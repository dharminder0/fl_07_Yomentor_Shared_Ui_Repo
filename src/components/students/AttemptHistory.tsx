import { ActivityIndicator, Dimensions, Image, Pressable, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View, VirtualizedList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { YoImages } from '../../assets/themes/YoImages';
import { getComplexityLevel, getUserInfo } from '../../shared/sharedDetails';
import { useThemeColor } from '../../assets/themes/useThemeColor';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAttemptHitory, getGradeList, getSkilsList, getSubjectByGradeId } from '../../apiconfig/SharedApis';
import Icon from "react-native-vector-icons/FontAwesome5";
import { Button, Card } from '@rneui/base';
import { btnStyle, cardStyle, common } from '../../assets/styles/Common';
import { Chip, Input, SearchBar } from '@rneui/themed';
import debounce from 'lodash.debounce';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';

const MySkillTests = () => {
    const { height, width } = Dimensions.get("window");
    const image: any = YoImages();
    const userInfo: any = getUserInfo();
    const YoColors = useThemeColor();
    const navigation: any = useNavigation();

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [history, setHistory] = useState<any>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [bottomLoading, setBottomLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isFilterModal, setIsFilterModal] = useState(false);

    const [selectedGrade, setSelectedGrade] = useState<any>(userInfo?.studentGradeId);
    const [gradeId, setGradeId] = useState<any>(0);
    const [selectedSubject, setSelectedSubject] = useState<any>(0);
    const [complexityLevel, setComplexityLevel] = useState<any>(0);
    const [subjectList, setSubjectList] = useState<any>([]);
    const [shouldFetch, setShouldFetch] = useState(false);

    const getSkilsListData = (isRefreshing = false) => {
        if (loading) return; // Prevent multiple API calls while loading
        if (bottomLoading) return; // Prevent multiple API calls while loading
        setBottomLoading(true);
        setRefreshing(isRefreshing);

        let payload = {
            userId: userInfo.id,
            searchText: search,
            gradeId: gradeId,
            pageSize,
            pageIndex: isRefreshing ? 1 : pageIndex, // Reset to page 1 on refresh
            subjectId: selectedSubject,
            complexityLevel: complexityLevel,
        };

        console.log("payload", payload)
        getAttemptHitory(payload)
            .then((response: any) => {
                if (response.data?.length > 0) {
                    if (isRefreshing) {
                        setHistory(response.data);
                        setPageIndex(2); // Next page would be 2
                    } else {
                        setHistory((prev: any) => [...prev, ...response.data]); // Append data for pagination
                        setPageIndex((prev) => prev + 1); // Increment pageIndex
                    }
                } else {
                    setHasMoreData(false); // No more data available
                }
            })
            .catch((error: any) => {
                console.error("Error fetching :", error);
            })
            .finally(() => {
                setBottomLoading(false);
                setLoading(false);
                setShouldFetch(false);
                setRefreshing(false);
            });
    };

    const handleSearch = (text: string) => {
        setSearch(text);
        setHistory([]); // Clear the list if the search is cleared
        setHasMoreData(true); // Reset data availability
        setPageIndex(1); // Reset page index
    };

    useFocusEffect(useCallback(() => {
        setLoading(true);
        setPageIndex(1); // Reset page index when search changes
        setHasMoreData(true); // Reset the flag for more data
        getSkilsListData(true); // Fetch data on search change (refresh)
    }, [search]));

    useEffect(() => {
        setHasMoreData(true); // Reset the flag for more data
        getSkilsListData(true); // Fetch data on search change (refresh)
    }, [pageIndex]);

    useEffect(() => {
        getGradeList(userInfo?.category).then((result: any) => {
            if (result.data) {
                setSelectedGrade(result.data.find((grade: any) => grade.id === userInfo?.studentGradeId));
            }
        });

        getSubjectByGradeId(userInfo?.studentGradeId).then((result: any) => {
            if (result?.data && result.data.length > 0) {
                setSubjectList(result.data);
            }
        });
    }, [userInfo?.category, userInfo?.studentGradeId])

    const loadMoreData = () => {
        if (hasMoreData && !bottomLoading) {
            getSkilsListData(); // Fetch next page
        }
    };

    const handleFilter = (type: any) => {
        if (type === 'clear') {
            setSelectedSubject(null);
            setComplexityLevel(null);
        }
        setShouldFetch(true);
        setIsFilterModal(false);
    }

    const handleChips = (type: string) => {
        if (type === 'subject') {
            setSelectedSubject(0);
        } else if (type === 'complexity') {
            setComplexityLevel(0);
        } else if (type === 'grade') {
            setGradeId(0);
        }
        setShouldFetch(true);
    }

    useEffect(() => {
        if (shouldFetch) {
            setLoading(true);
            setHistory([]);
            setPageIndex(1);
            getSkilsListData(true);
        }
    }, [shouldFetch]);

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
                navigation.navigate("SkillTestDetails", { skillId: item?.skillTestId })
            }
            key={item?.id}
            style={[styles.itemContainer, { backgroundColor: YoColors.background }]}
        >
            <View style={[common.j_row]}>
                <View style={[common.pe5, { width: 60 }]}>
                    {item?.subjectIconUrl &&
                        <Image source={{ uri: item?.subjectIconUrl }} height={32} width={32} style={{ alignSelf: 'center' }} />
                    }
                    <Text style={[common.rText, common.tCenter]} numberOfLines={2}>{item?.subjectName}</Text>
                </View>
                <View
                    style={{
                        width: '83%',
                    }}
                >
                    {item.skillTestTitle && (
                        <View style={[cardStyle.row]}>
                            <Text style={[common.title]}>
                                {item.skillTestTitle}
                            </Text>
                        </View>
                    )}
                    <View style={common.row}>
                        {item?.startDate &&
                            <View style={[cardStyle.row, common.pe5]}>
                                <Icon name="calendar" size={12} />
                                <Text style={common.rText}> {moment(item?.startDate).format('DD-MM-YYYY')}</Text>
                            </View>
                        }
                        {item?.score > 0 &&
                            <View style={[cardStyle.row, common.pe5]}>
                                <Icon name="shield-alt" size={12} />
                                <Text style={common.rText}> Score: {item?.score}</Text>
                            </View>
                        }
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const keyExtractor = (item: any) => item.id.toString();
    const getItem = (data: any, index: any) => data[index];
    const getItemCount = (data: any) => data.length;

    return (
        <View>
            <View style={[common.px12, { height: (selectedSubject > 0 || complexityLevel > 0 || gradeId > 0 ? 80 : 55) }]}>
                <View style={[common.j_row, common.mtop10, { width: width - 25, alignItems: 'center' }]}>
                    <View style={{ width: width - 75 }}>
                        <TextInput
                            placeholder="Search Skill Test"
                            onChangeText={handleSearch}
                            value={search}
                            style={[common.input, { marginBottom: 0, height: 40 }]}
                            placeholderTextColor={YoColors.placeholderText}
                        />

                        {search && search?.length > 0 ? (
                            <Ionicons
                                onPress={() => handleSearch("")}
                                name="close-sharp"
                                size={21}
                                style={{ position: "absolute", right: 10, top: 12 }}
                            />
                        ) : (
                            <Ionicons
                                name="search-outline"
                                size={21}
                                style={{ position: "absolute", right: 10, top: 10 }}
                            />
                        )}
                    </View>
                    <View style={{ width: 40 }}>
                        <Button radius={"sm"} type="clear" onPress={() => setIsFilterModal(true)}>
                            <Ionicons name="filter" color={YoColors.primary} size={18} />
                        </Button>
                    </View>
                </View>
                <View style={common.row}>
                    {gradeId > 0 &&
                        <Chip
                            title={selectedGrade?.name}
                            icon={{
                                name: 'close',
                                type: 'ionicons',
                                size: 12,
                                color: YoColors.primary,
                            }}
                            onPress={() => handleChips('grade')}
                            iconRight
                            type="outline"
                            buttonStyle={{ width: 'auto', padding: 0, borderColor: YoColors.primary }}
                            titleStyle={[common.fs12, { color: YoColors.primary }]}
                            containerStyle={common.mr10}
                        />
                    }
                    {complexityLevel > 0 &&
                        <Chip
                            title={(getComplexityLevel().find((item: any) => complexityLevel == item.id))?.name}
                            icon={{
                                name: 'close',
                                type: 'ionicons',
                                size: 12,
                                color: YoColors.primary,
                            }}
                            onPress={() => handleChips('complexity')}
                            iconRight
                            type="outline"
                            buttonStyle={{ width: 'auto', padding: 0, borderColor: YoColors.primary }}
                            titleStyle={[common.fs12, { color: YoColors.primary }]}
                            containerStyle={common.mr10}
                        />
                    }

                    {selectedSubject > 0 &&
                        <Chip
                            title={(subjectList.find((item: any) => selectedSubject == item.id))?.name}
                            icon={{
                                name: 'close',
                                type: 'ionicons',
                                size: 12,
                                color: YoColors.primary,
                            }}
                            onPress={() => handleChips('subject')}
                            iconRight
                            type="outline"
                            buttonStyle={{ width: 'auto', padding: 0, borderColor: YoColors.primary }}
                            titleStyle={[common.fs12, { color: YoColors.primary }]}
                            containerStyle={common.mr10}
                        />
                    }
                </View>
            </View>

            {history?.length > 0 ?
                <VirtualizedList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    getItem={getItem}
                    getItemCount={getItemCount}
                    initialNumToRender={10} // Number of items to render initially
                    style={{ height: height - (selectedSubject > 0 || complexityLevel > 0 || gradeId > 0 ? 180 : 160) }}
                    windowSize={(selectedSubject > 0 || complexityLevel > 0 || gradeId > 0 ? 180 : 160)}
                    contentContainerStyle={[common.px12, common.py5]}
                    onScrollEndDrag={loadMoreData}
                    onEndReachedThreshold={0.7}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => getSkilsListData(true)}
                        />
                    }
                    ListFooterComponent={
                        <>
                            {bottomLoading && <ActivityIndicator />}
                        </>
                    }
                /> : loading ?
                    <View style={{ height: height - 170, justifyContent: 'center' }}>
                        <ActivityIndicator size='large' />
                    </View> :
                    <View style={[{ height: '90%', justifyContent: 'center', alignItems: 'center', }]}>
                        <View style={[common.mb10, { alignItems: 'center', borderRadius: 6, width: '100%' }]}>
                            <Image
                                style={[common.mtop10, { width: 200, height: 240 }]}
                                resizeMode="contain"
                                source={require('../../assets/images/onboard.png')}
                            />
                            {(search?.length > 0 || selectedSubject > 0 || complexityLevel > 0 || gradeId > 0) ?
                                <Text style={[common.mb10, { color: YoColors.primary, textAlign: 'center' }]}>Sorry, we couldn't find any tests matching your search criteria. Create a new test tailored to your needs.</Text>
                                :
                                <Text style={[common.mb10, { color: YoColors.primary, textAlign: 'center' }]}>You haven't created any tests yet! Design a test tailored to your needs and take control of your learning.</Text>
                            }
                            <Button
                                title="Create New Test"
                                onPress={() => navigation.navigate("CreateSkillTest")}
                                buttonStyle={[btnStyle.solid]}
                                titleStyle={[common.fs12]}
                                containerStyle={[common.mb10, { width: 150 }]}
                            />
                        </View>
                    </View>
            }

            <Modal
                isVisible={isFilterModal}
                onBackButtonPress={() => handleFilter('clear')}
                onBackdropPress={() => handleFilter('clear')}
                swipeDirection="down"
                style={{ margin: 0, alignItems: "center", justifyContent: 'flex-end' }}
                useNativeDriver
            >
                <View
                    style={[common.px12, {
                        backgroundColor: YoColors.background,
                        minHeight: '42%',
                        maxHeight: '85%',
                        width: '100%',
                    }]}
                >
                    <Text style={[common.h3Title, common.my10]}>Select Filters</Text>

                    <ScrollView>
                        <View>
                            <Text style={[common.title, common.mb10]}>Grade</Text>
                            {userInfo?.studentGradeId &&
                                <Card containerStyle={[styles.cardContainer, { backgroundColor: (selectedGrade?.id == gradeId ? YoColors.bgColor : 'white') }]}>
                                    <Pressable onPress={() => { setGradeId(userInfo?.studentGradeId); }}>
                                        <Image
                                            style={styles.cardImage}
                                            resizeMode="contain"
                                            source={!selectedGrade?.icon ? image.knowledge : { uri: selectedGrade.icon }}
                                        />
                                        <Text style={[common.rText, common.tCenter]}>{selectedGrade?.name}</Text>
                                    </Pressable>
                                </Card>
                            }
                        </View>
                        <View>
                            <Text style={[common.title, common.mb10]}>Area</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {subjectList && subjectList?.length > 0 &&
                                    subjectList.map((item: any) => {
                                        return (
                                            <Card key={item.id} containerStyle={[styles.cardContainer, { backgroundColor: (selectedSubject == item.id ? YoColors.bgColor : 'white') }]}>
                                                <Pressable onPress={() => { setSelectedSubject(item.id); }}>
                                                    <Image
                                                        style={styles.cardImage}
                                                        resizeMode="contain"
                                                        source={!item?.icon ? image.subject : { uri: item.icon }}
                                                    />
                                                    <Text style={[common.rText, common.tCenter]}>{item.name}</Text>
                                                </Pressable>
                                            </Card>
                                        )
                                    })}
                            </View>
                        </View>
                        <View>
                            <Text style={[common.title, common.mb10]}>Complexity</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {getComplexityLevel().map((item: any) => {
                                    return (
                                        <Card key={item.id} containerStyle={[styles.cardContainer, { backgroundColor: (complexityLevel == item.id ? YoColors.bgColor : 'white') }]}>
                                            <Pressable onPress={() => { setComplexityLevel(item.id); }}>
                                                <Image
                                                    style={styles.cardImage}
                                                    resizeMode="contain"
                                                    source={image.complexity}
                                                />
                                                <Text style={[common.rText, common.tCenter]}>{item.name}</Text>
                                            </Pressable>
                                        </Card>
                                    )
                                })}
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Button
                                title="Clear"
                                type="outline"
                                buttonStyle={{ borderColor: YoColors.primary }}
                                titleStyle={btnStyle.outlineTitle}
                                containerStyle={{
                                    width: '40%',
                                    marginVertical: 10,
                                    marginRight: 12
                                }}
                                onPress={() => handleFilter('clear')}
                            />
                            <Button
                                title="Apply"
                                buttonStyle={{
                                    backgroundColor: YoColors.primary,
                                    borderRadius: 3,
                                }}
                                containerStyle={{
                                    width: '40%',
                                    marginVertical: 10,
                                }}
                                onPress={() => handleFilter('apply')}
                            />
                        </View>
                    </ScrollView>

                </View>
            </Modal>
        </View>
    )
}

export default MySkillTests

const styles = StyleSheet.create({
    itemContainer: {
        borderRadius: 6,
        marginBottom: 8,
        padding: 6
    },
    itemText: {
        fontSize: 16,
    },
    inputContainer: {
        borderWidth: 1,
        borderRadius: 4,
    },
    inputStyle: {
        padding: 10,
        borderRadius: 4,
    },
    cardContainer: {
        width: Dimensions.get('window').width / 4.56,
        padding: 5,
        margin: 0,
        marginBottom: 10,
        marginRight: 5
    },
    cardImage: {
        width: "100%",
        height: 30,
        marginVertical: 5
    },
    cardTitle: {
        marginBottom: 0
    },
})
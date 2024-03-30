import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { cardStyle, common } from "../../assets/styles/Common";
import { Button, Rating } from "react-native-elements";
import { YoColors } from "../../assets/themes/YoColors";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "react-native-gesture-handler";
import { getUserInfo } from "../../shared/sharedDetails";
import { getReviews, upsertReviews } from "../../apiconfig/SharedApis";
import { useToast } from "react-native-toast-notifications";
import { Card } from "@rneui/base";
import moment from "moment";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Loading from "../../screens/Loading";

const AddReview = ({ batchDetail }: any) => {
  const userInfo: any = getUserInfo();
  const toast: any = useToast();
  const [reviewList, setReviewList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  }: any = useForm();

  useEffect(() => {
    getReviewList();
    setValue("batchId", batchDetail?.id);
    setValue("rating", 4);
    setValue("addedBy", userInfo?.id);
    setValue("addedFor", batchDetail?.teacherInformation.id);
  }, []);

  const getReviewList = () => {
    setIsLoading(true);
    const payload: any = {
      addedBy: userInfo?.id,
      // addedFor: batchDetail?.teacherInformation.id,
      batchId: batchDetail?.id,
      pageSize: 10,
      pageIndex: 1,
    };
    getReviews(payload).then((response: any) => {
      if (response.data && response.data?.length > 0) {
        setReviewList(response.data);
      }
      setIsLoading(false);
    });
  };

  const ratingCompleted = (rating: number) => {
    setValue("rating", rating);
  };

  const onSubmit = (data: any) => {
    upsertReviews(data)
      .then((response: any) => {
        if (response.data && response.data.success) {
          toast.show("Review added successfully", {
            type: "success",
            duration: 2000,
          });
          getReviewList();
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <>
      {reviewList && reviewList?.length > 0 ? (
        <View style={[common.container]}>
          {reviewList?.map((item: any, key: number) => (
            <Card containerStyle={cardStyle.container} key={key}>
              <View style={common.j_row}>
                <Text style={[common.title, common.mb5]}>
                  {item?.batchTitle}
                </Text>
                <Text style={common.rText}>
                  {moment(item?.createDate).format("DD MMM, YYYY")}
                </Text>
              </View>
              <Text style={common.rText} numberOfLines={20}>
                {item?.review}
              </Text>
              <View style={[common.j_row, common.mtop10]}>
                <Text style={common.rText} numberOfLines={20}>
                  {item?.addedByFirstName + " " + item?.addedByLastName}
                </Text>
                {item?.rating > 0 && (
                  <Text style={common.rText}>
                    {Array.from(Array(item?.rating).keys())?.map(
                      (key: number) => (
                        <MaterialCommunityIcons
                          name="star"
                          size={12}
                          color={YoColors.star}
                          key={key}
                        />
                      )
                    )}
                  </Text>
                )}
              </View>
            </Card>
          ))}
        </View>
      ) : isLoading ? (
        <Loading />
      ) : (
        <View style={[common.container, { alignItems: "flex-end" }]}>
          <Rating
            imageSize={20}
            startingValue={4}
            onFinishRating={ratingCompleted}
            onSwipeRating={ratingCompleted}
            style={{ marginVertical: 10 }}
          />

          <Controller
            control={control}
            name="review"
            defaultValue=""
            rules={{ required: "Review is required" }}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  placeholder="Write a review..."
                  onChangeText={onChange}
                  value={value}
                  style={[
                    common.input,
                    {
                      minHeight: 100,
                      verticalAlign: "top",
                      borderColor: errors.review ? "red" : "#ccc",
                    },
                  ]}
                  multiline={true}
                />
              </>
            )}
          />
          <Button
            title="Submit"
            onPress={handleSubmit(onSubmit)}
            buttonStyle={{ backgroundColor: YoColors.primary, marginTop: 20 }}
            titleStyle={{ fontWeight: "600" }}
            containerStyle={{ width: "40%" }}
          />
        </View>
      )}
    </>
  );
};

export default AddReview;

const styles = StyleSheet.create({});

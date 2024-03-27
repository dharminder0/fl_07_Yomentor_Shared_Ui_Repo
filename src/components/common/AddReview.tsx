import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { common } from "../../assets/styles/Common";
import { Button, Rating } from "react-native-elements";
import { YoColors } from "../../assets/themes/YoColors";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "react-native-gesture-handler";
import { getUserInfo } from "../../shared/sharedDetails";
import { getReviews, upsertReviews } from "../../apiconfig/SharedApis";
import { useToast } from "react-native-toast-notifications";

const AddReview = ({ batchId = 0 }) => {
  const userInfo: any = getUserInfo();
  const toast: any = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  }: any = useForm();

  useEffect(() => {
    getReviewList();
    setValue("batchId", batchId);
    setValue("rating", 4);
    setValue("addedBy", userInfo?.id);
  }, []);

  const getReviewList = () => {
    const payload: any = {
      addedBy: userInfo?.id,
      batchId: batchId,
      pageSize: 10,
      pageIndex: 1,
    };
    console.log(payload);
    getReviews(payload).then((response: any) => {
      console.log(response.data);
    });
  };

  const ratingCompleted = (rating: number) => {
    setValue("rating", rating);
  };

  const onSubmit = (data: any) => {
    upsertReviews(data).then((response: any) => {
      if (response.data && response.data.success) {
        toast.show("Review added successfully", {
          type: "success",
          duration: 2000,
        });
      }
    });
  };

  return (
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
              style={[common.input, { minHeight: 100, verticalAlign: "top" }]}
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
  );
};

export default AddReview;

const styles = StyleSheet.create({});

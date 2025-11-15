import catchAsync from "../utils/catchAsync";
import httpsCall from "./httpsCall";

export const analyzeForm = catchAsync(async (postdata: any) => {
  const data = await httpsCall.post(`/rca/analyze`,postdata);
  return data;
});

export const sendEmail = catchAsync(async (postdata: any) => {
  const data = await httpsCall.post(`/rca/sendEmail`,postdata);
  return data;
});

export const sendFeedback = catchAsync(async (postdata: any) => {
  const data = await httpsCall.post(`/rca/sendFeedback`,postdata);
  return data;
});
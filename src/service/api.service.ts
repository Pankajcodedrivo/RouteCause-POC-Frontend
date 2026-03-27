import catchAsync from "../utils/catchAsync";
import httpsCall from "./httpsCall";

export const analyzeForm = catchAsync(async (postdata: any) => {
  const data = await httpsCall.post(`/analyze`,postdata);
  return data;
});

export const sendEmail = catchAsync(async (report_id,postdata: any) => {
  const data = await httpsCall.post(`/report/${report_id}/email`,postdata);
  return data;
});

export const sendFeedback = catchAsync(async (report_id,postdata: any) => {
  const data = await httpsCall.post(`/report/${report_id}/email`,postdata);
  return data;
});
export const downloadReportPdf = async (report_id: string) => {
  const response = await httpsCall.get(
    `/report/${report_id}?format=pdf`,
    {
      responseType: "blob", // VERY IMPORTANT
    }
  );

  return response;
};
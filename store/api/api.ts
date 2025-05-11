import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQuery from "../baseQuery";
// import { objectToUrlEncodedString } from './helpers';
// import {
//     APISession,
//     NewGiverSwapShiftType,
//     Shift,
//     ShiftsType,
//     ManagerInfoProps,
//     CalendarItemInterface,
//     WeatherInfo,
//     NotificationAlert,
//     PayHistData,
//     GetAccountInfo,
//     GetAlertsSettings,
//     PublishScheduleType,
//     PublishDataType,
//     RequestItem,
//     RequestItemBase,
// } from './types';
// import { setAppTimezone } from '../../helpers';
interface ProposeShiftProps {
  so: string | number;
  sd: string | number;
  reason: any;
  status: number;
}

export const objectToUrlEncodedString = (
  obj: Record<string, string | number>
) => {
  // @ts-ignore
  const urlEncoded = new URLSearchParams(obj);
  return urlEncoded.toString();
};

export const api = createApi({
  // exp://192.168.1.161:8081//android real device must point here

  // http://127.0.0.1:8000/reviews/
  // baseQuery: fetchBaseQuery({ baseUrl: "http://10.0.2.2:8000/" }), // works for iphone
  // baseQuery: fetchBaseQuery({ baseUrl: "http://172.20.10.3:8000/" }), // works for iphone
  baseQuery: fetchBaseQuery({ baseUrl: "http://192.168.1.161:8000/" }), //local
  //   baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/" }),
  // baseQuery,
  reducerPath: "api",
  tagTypes: ["company", "review", "event", "recommendation", "business"],
  endpoints: (build) => ({
    getWeather: build.query<any, void>({
      // TODO: move this endpoint to the main mocked server and update it here
      queryFn: async () => {
        const req = await fetch("https://api.escuelajs.co/api/v1/products");
        // const req = await fetch('http://127.0.0.1:8000/bryan/book');
        // const req = await fetch('https://86e340d4-3250-4c74-89f3-6a1b5a874fa5.mock.pstmn.io/weather/me/');
        const resp = await req.json();
        return { data: resp };
      },
    }),

    // proposeShiftSwap: build.mutation<ProposeShiftProps, ProposeShiftProps>({
    //     invalidatesTags: ['empRequests'],
    //     query: ({ so, sd, status, reason }) => {
    //         return {
    //             url: 'public/assets/inc/update.inc.php',
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //             },
    //             body: objectToUrlEncodedString({
    //                 action: 'api-proposeshiftswap',
    //                 so,
    //                 sd,
    //                 status,
    //                 reason,
    //             }),
    //         };
    //     },
    // }),
    getBooks: build.query({
      query: () => ({}), // Empty query object since we're fetching all books
    }),
    getDjango: build.query({
      query: () =>
        console.log("WE HER FIRST", data) || {
          // url: 'public/assets/inc/update.inc.php',
          url: "bryan/bookPost",
          method: "POST",
          // url: 'public/assets/inc/update.inc.php',
          params: {},
        },
      // providesTags: ['shiftsToGrab'],
      // temp fix: convert object to array
      // transformResponse: (response) => {
      //    console.log('response is on us',response)
      // },
    }),

    // offerShiftRequest: build.mutation<
    //     { result: string },
    //     { shift_id: string | number; reason?: string; cancel?: boolean }
    // >({
    //     query: ({ shift_id, reason, cancel }) => {
    //         return {
    //             url: 'public/assets/inc/update.inc.php',
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //             },
    //             body: objectToUrlEncodedString({
    //                 action: 'api-shiftgiveup',
    //                 shift_id,
    //                 // "1" - This trade is active and the shift can be picked up by others.
    //                 // "0" - Cancel the shift trade. If the shift trade doesn't exist, this operation will fail
    //                 status: cancel ? 0 : 1,
    //                 // This appears to be a retired feature. Always pass "1".
    //                 // Prior to 2015, we allowed "0", it's unclear what that option does. Let's not use it.
    //                 public: 1,
    //                 reason: reason ?? '',
    //             }),
    //         };
    //     },
    //     invalidatesTags: ['myShifts', 'empRequests'],
    // }),
    // subscribeForPushNotifications: build.mutation<
    //     any,
    //     { devuuid: string; devtoken: string; pushNotificationEndpoint: 'android' | 'ios' | 'ios-development' }
    // >({
    //     query: ({ devtoken, devuuid, pushNotificationEndpoint }) => ({
    //         url: 'public/assets/inc/update.inc.php',
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //         body: objectToUrlEncodedString({
    //             action: 'api-subscribeforpushnotifications',
    //             devtoken,
    //             devuuid,
    //             pushNotificationEndpoint,
    //         }),
    //     }),
    // }),
    // grabShiftRequest: build.mutation<
    //     { status: string; message?: string },
    //     { shift_id: string | number; cancel?: boolean }
    // >({
    //     query: ({ shift_id, cancel }) => ({
    //         url: 'public/assets/inc/update.inc.php',
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //         body: objectToUrlEncodedString({
    //             action: 'api-shiftrequest',
    //             shift_id,
    //             // "0" - Delete an existing request for a shift. The system will *not* error out if the request doesn't already exist.
    //             // "1" - Create a request for a shift
    //             status: cancel ? 0 : 1,
    //         }),
    //     }),
    //     invalidatesTags: ['shiftsToGrab', 'empRequests'],
    // }),
    // apiSession: build.query<APISession, void>({
    //     query: () => ({
    //         url: 'public/assets/inc/update.inc.php',
    //         params: {
    //             action: 'api-session',
    //         },
    //     }),
    //     transformResponse: (base: APISession) => {
    //         if (base?.content?.user?.timezone) {
    //             // setAppTimezone(base.content.user.timezone);
    //         }
    //         return base;
    //     },
    // }),

    // getMyShifts: build.query<ShiftsType, { startDate: string; limit: number }>({
    //     query: ({ startDate, limit }) => ({
    //         url: 'public/assets/inc/update.inc.php',
    //         params: {
    //             action: 'api-myshifts',
    //             date: startDate,
    //             days: limit,
    //         },
    //     }),
    //     providesTags: ['myShifts'],
    // }),

    // isPublished: build.query<PublishScheduleType[], { loc_id?: string; startDate: string }>({
    //     query: ({ loc_id, startDate }) => ({
    //         url: 'public/assets/inc/update.inc.php',
    //         params: {
    //             action: 'api-is-published',
    //             datestr: startDate,
    //             loc_id,
    //         },
    //     }),
    // }),

    // submitPTO: build.mutation<any, any>({
    //     query: ({ startTime, endTime, startDate, endDate, comment }) => {
    //         return {
    //             url: 'public/assets/inc/update.inc.php',
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //             },

    //             body: objectToUrlEncodedString({
    //                 action: 'api-submitpto',
    //                 'start_time[]': startTime,
    //                 'end_time[]': endTime,
    //                 start_date: startDate,
    //                 end_date: endDate,
    //                 comment: comment,
    //             }),
    //         };
    //     },;
    // }),
    googleAuth: build.mutation<any, any>({
      query: (data) => {
        console.log("GOOGLE NOW BABY", data);
        return {
          url: "authentication/googleAuth/",
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Use JSON
          },
          body: JSON.stringify({
            userData: data,
          }),
        };
      },
    }),
    addBook: build.mutation<any, any>({
      query: (data) => {
        console.log("ADDOMG BUSIENSS BACK gone", data);
        return;
        return {
          url: "bryan/bookPost/",
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: objectToUrlEncodedString({
            title: data.title,
            author: data.author,
            year: data?.year,
          }),
        };
      },
    }),
    addReview: build.mutation<any, any>({
      query: (data) => {
        console.log("data is king add revieww", data);
        return {
          url: `reviews/${data.userId}/${data.companyId}/addReview/`,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: JSON.stringify({
            rating: data.rating,
            review: data.review,
            price: data.rating[0],
            music: data.rating[1],
            amenities: data.rating[2],
            food: data.rating[3],
            vibes: data.rating[4],
            pickup: data.rating[5],
            costume: data.rating[6],
            value: data.rating[7],
            service: data.rating[8],
          }),
        };
      },
      invalidatesTags: ["review"],
    }),
    addFeedback: build.mutation<any, any>({
      query: (data) => {
        console.log("data is king add revieww", data);
        return {
          url: `feedback/addFeedback/`,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: JSON.stringify({
            feedback: data.feedback,
          }),
        };
      },
    }),
    addEditSuggestion: build.mutation<any, any>({
      query: (data) => {
        console.log("ON OUR WAY TO THE BACK", data);
        // return;
        return {
          url: `suggestion/addEditSuggestion/`,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: JSON.stringify({
            suggestion_text: data.description,
            type: data.type,
            entity_id: data.entityId,
            user_id: data.userId,
          }),
        };
      },
    }),
    addRec: build.mutation<any, any>({
      query: (data) => {
        console.log("data is king add revieww", data);
        // return;
        return {
          url: `company/addRec/`,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: JSON.stringify({
            rec: data.rec,
            user_id: data.userId,
            company_id: data.companyId,
          }),
        };
      },
      invalidatesTags: ["recommendation"],
    }),
    addReviewAgreement: build.mutation<any, any>({
      query: (data) => {
        console.log("AGREEMMENT ADD jake", data);
        // return;
        return {
          url: `reviews/addRevAgreement/`,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: JSON.stringify({
            agreement: data.agreem,
            user_id: data.userId,
            reviewId: data.reviewId,
          }),
        };
      },
    }),
    getCompanyRecs: build.query<any, any>({
      query: (data) => {
        console.log("data is king add revieww", data);
        // return;
        return {
          url: `company/${data.companyId}/getCompanyRecs/`,
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
      },
      providesTags: ["recommendation"],
    }),
    addCompanyImages: build.mutation<any, any>({
      query: (data) => {
        const companyId = data.companyInfo?.companyId;
        const userId = data.user.data.user.user_id;

        console.log("BEFORE DJANGO DUDE", userId, companyId);
        // return;
        return {
          url: `company/${userId}/${companyId}/addCompanyImages/add/`,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: JSON.stringify({
            // feedback: data.feedback,
            imageUrls: data.imageUrls,
          }),
        };
      },
    }),
    getCompanyImages: build.query<any, any>({
      query: (data) => {
        // const companyId = data.companyInfo?.companyId;
        const companyId = data.companyId;

        return {
          url: `company/${companyId}/getCompanyImages/get`,
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
      },
    }),
    addEvent: build.mutation<any, any>({
      query: (data) => {
        const userId = data?.userId;
        console.log("back in the back evets", data);
        // return;
        return {
          url: `event/${userId}/addEvent/`,
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Use JSON
          },
          body: JSON.stringify({
            // Use JSON.stringify
            eventInfo: data.eventInfo,
            allImages: data.allImages,
            eventHours: data.eventHours,
          }),
        };
      },
      invalidatesTags: ["event"],
    }),
    editEvent: build.mutation<any, any>({
      query: (data) => {
        const eventId = data?.eventId;
        console.log("ADD event NOW.hours", eventId);
        // return;
        return {
          url: `event/${eventId}/editEvent/`,
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Use JSON
          },
          body: JSON.stringify({
            // Use JSON.stringify
            eventInfo: data.eventInfo,
            allImages: data.allImages,
            eventHours: data.eventHours,
          }),
        };
      },
      invalidatesTags: ["event"],
    }),
    editVerifiedBusiness: build.mutation<any, any>({
      query: (data) => {
        const businessId = data.companyInfo?.businessId;
        console.log("MONKEY WAS", data);
        return {
          url: `business/${businessId}/editVerifiedBusiness/`,
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Use JSON
          },
          body: JSON.stringify({
            // Use JSON.stringify
            companyInfo: data.companyInfo,
            imageUrls: data.allImages,
            hoursData: data.hoursData,
          }),
        };
      },
      invalidatesTags: ["business"],
    }),
    getAllEvents: build.query<any, any>({
      query: (data) => {
        console.log("ADD event NOW.hours", data);
        return {
          url: `event/${data?.country}/getAllEvents/`,
          method: "GET",
          headers: {
            "Content-Type": "application/json", // Use JSON
          },
        };
      },
      providesTags: ["event"],
    }),
    addBusiness: build.mutation<any, any>({
      query: (data) => {
        const userId = data?.userId;
        // return;
        return {
          url: `business/${userId}/addBusiness/`,
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Use JSON
          },
          body: JSON.stringify({
            // Use JSON.stringify
            companyInfo: data.companyInfo,
            imageUrls: data.allImages,
            hoursData: data.hoursData,
          }),
        };
      },
      invalidatesTags: ["business"],
    }),
    addUnverifiedBusiness: build.mutation<any, any>({
      query: (data) => {
        const userId = data?.userId;
        console.log("ALL PHOTOS TO THE BACK", data.validURLs);
        return {
          url: `business/${userId}/addUnverifiedBusiness/`,
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Use JSON
          },
          body: JSON.stringify({
            // Use JSON.stringify
            companyInfo: data.companyInfo,
            imageUrls: data.validURLs,
            hoursData: data.hoursData,
          }),
        };
      },
    }),
    duplicateCheck: build.mutation<any, any>({
      query: (data) => {
        console.log("duplicateCheck", data);
        // return;
        return {
          url: `duplicates/duplicationCheck/`,
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Use JSON
          },
          body: JSON.stringify({
            // Use JSON.stringify
            name: data.name,
            country: data.country,
            type: data.type,
          }),
        };
      },
    }),
    getBusinesses: build.query<any, any>({
      query: (data) => {
        const userId = data?.userId;
        console.log("ADD COMAPNY NOW", data);
        // return;
        return {
          url: `business/${data?.country}/getBusinesses/`,
          method: "GET",
          headers: {
            "Content-Type": "application/json", // Use JSON
          },
          // body: JSON.stringify({
          //   // Use JSON.stringify
          //   companyInfo: data.companyInfo,
          //   imageUrls: data.allImages,
          //   hoursData: data.hoursData,
          // }),
        };
      },
      providesTags: ["business"],
    }),
    addCompany: build.mutation<any, any>({
      query: (data) => {
        const userId = data?.userId;
        return {
          url: `company/${userId}/addUnverifiedCompany/`,
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Use JSON
          },
          body: JSON.stringify({
            // Use JSON.stringify
            companyInfo: data.companyInfo,
            imageUrls: data.allImages,
            hoursData: data.hoursData,
          }),
        };
      },
      invalidatesTags: ["company"],
    }),
    getReviews: build.query({
      query: (data) => ({
        url: `reviews/${data.companyId}/getReviews/`,
        params: {},
      }),
      providesTags: ["review"],
    }),
    getCompanies: build.query({
      query: (data) =>
        console.log("data country", data) || {
          url: `company/${data?.country}/getCompanies/`,
          params: {},
        },
      providesTags: ["company"],
    }),

    // submitMessge: build.mutation<any, any>({
    //     query: ({ notes, punchId, shiftId }) => {
    //         return {
    //             url: 'public/assets/inc/update.inc.php',
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //             },

    //             // If a punchId is available, add a punchId. This will trigger a timeclock note on the backend.
    //             // If a punchId isn't available, it should be submitted as an empty string. A lack of a punchId will trigger
    //             // a shift change note.
    //             // A shiftId should always be available. Always submit that.
    //             body: objectToUrlEncodedString({
    //                 action: 'api-addclockinnote',
    //                 notes,
    //                 punch_id: punchId,
    //                 shift_id: shiftId,
    //             }),
    //         };
    //     },
    //     invalidatesTags: ['payHistory'],
    // }),

    // submitUnavailability: build.mutation<
    //     string,
    //     {
    //         startDate: string;
    //         minHours: number;
    //         maxHours: number;
    //         minShifts: number;
    //         maxShifts: number;
    //         comment: string;
    //         items: { startTime: string; endTime: string; dayOfWeek: number }[];
    //     }
    // >({
    //     query: ({ startDate, minHours, minShifts, maxShifts, maxHours, comment, items }) => ({
    //         url: 'public/assets/inc/update.inc.php',
    //         method: 'POST',
    //         params: {
    //             action: 'api-setunavailability',
    //         },

    //         body: {
    //             minHours,
    //             maxHours,
    //             maxShifts,
    //             minShifts,
    //             comment,
    //             startDate,
    //             items,
    //         },
    //     }),
    //     invalidatesTags: ['unavailabilityCalendar'],
    // }),
  }),
  refetchOnMountOrArgChange: true,
});
export const {
  useEditVerifiedBusinessMutation,
  useDuplicateCheckMutation,
  useAddReviewAgreementMutation,
  useGetBooksQuery,
  useGetWeatherQuery,
  useGetDjangoQuery,
  useGetCompaniesQuery,
  useAddReviewMutation,
  useAddCompanyMutation,
  useGetCompanyImagesQuery,
  useGoogleAuthMutation,
  useGetReviewsQuery,
  useAddEditSuggestionMutation,
  useAddFeedbackMutation,
  useAddEventMutation,
  useGetAllEventsQuery,
  useAddCompanyImagesMutation,
  useAddRecMutation,
  useGetCompanyRecsQuery,
  useAddBusinessMutation,
  useAddUnverifiedBusinessMutation,
  useEditEventMutation,
  useGetBusinessesQuery,
  // useAddBookMutation,
  useGetMyShiftsQuery,
  useGetCalendarDataQuery,
  useApiSessionQuery,
  useGetSchedulesQuery,
  useGetPayrollGroupQuery,
  useGetShiftsToGrabQuery,
  useOfferShiftRequestMutation,
  useGrabShiftRequestMutation,
  useGetTeamShiftsQuery,
  useGetAccountInfoQuery,
  useGetPTORequestsQuery,
  useGetAlertsSettingsQuery,
  useToggleAllowAlertsMutation,
  useSetAlertMutation,
  useGetSwapAlertsQuery,
  useGetUpcomingShiftsQuery,
  useGetManagersOnDutyQuery,
  useProposeShiftSwapMutation,
  useShiftManagementApprovalMutation,
  useGetPTOQuery,
  useSubmitPTOMutation,
  useCancelTimeOffMutation,
  useGetTodayWeatherQuery,
  useGetUnavailabilityCalendarQuery,
  useGetPayHistoryQuery,
  useGetNotficationAlertsQuery,
  useSubmitUnavailabilityMutation,
  useCancelUnavailabilityRequestMutation,
  useSubmitMessgeMutation,
  useSubscribeForPushNotificationsMutation,
  useIsPublishedQuery,
  usePublishedCountsQuery,
  useGetSwappableShiftsQuery,
  useGetMyRequestsQuery,
} = api;

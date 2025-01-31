import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { getAPIUrls } from '../../constants';
// import { getCookies } from '../../helpers';

// const BASE_URL = getAPIUrls().BASE_URL;

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/',
    credentials: 'omit',
    prepareHeaders: async headers => {
        // Set auth cookie to the request
        // try {
        //     const cookies = await getCookies(BASE_URL);
        //     if (cookies.PHPSESSID) {
        //         headers.set('Cookie', `PHPSESSID=${cookies.PHPSESSID.value};`);
        //     }
        // } catch (error) { }

        // return headers;
    },
});

export default baseQuery;

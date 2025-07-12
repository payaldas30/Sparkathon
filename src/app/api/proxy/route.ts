// // app/api/proxy/route.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);

//   // Extract both the target endpoint AND query parameters
//   const targetEndpoint = searchParams.get("endpoint"); // e.g. 'scrape'
//   const originalQuery = request.nextUrl.searchParams;

//   if (!targetEndpoint) {
//     return NextResponse.json(
//       { error: "Missing target endpoint" },
//       { status: 400 }
//     );
//   }

//   // Reconstruct the complete internal URL
//   const internalUrl = new URL(
//     `/api/${targetEndpoint}${
//       originalQuery.toString() ? `?${originalQuery}` : ""
//     }`,
//     request.nextUrl.origin
//   );
//   const getRandomUserAgent = (): string => {
//     const userAgents = [
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
//       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
//       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
//       "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
//     ];
//     return userAgents[Math.floor(Math.random() * userAgents.length)];
//   };
//   const getRandomReferer = (): string => {
//     const referers = [
//       "https://www.google.com/",
//       "https://duckduckgo.com/",
//       "https://www.bing.com/",
//       "https://search.yahoo.com/",
//       "https://www.ecosia.org/",
//       "https://www.startpage.com/",
//       "https://searx.org/",
//       "https://www.qwant.com/",
//       "https://yandex.com/",
//       "https://www.baidu.com/",
//     ];
//     return referers[Math.floor(Math.random() * referers.length)];
//   };

//   // Preserve headers
//   const headers = new Headers();
//   headers.set("User-Agent", getRandomUserAgent());
//   headers.set("Referer", getRandomReferer());
//   headers.set(
//     "Cookie",
//     '_pxvid=37421428-5bba-11f0-b946-c403d4cbe213; adblocked=false; ACID=7f8cd1dc-0290-4b25-9dbf-0229af7593db; _m=9; hasACID=true; abqme=true; _pxhd=8a6bfa00bfedac994690b16cbea78451d814eb39636d5b5062ef113ae4b2aac1:3773629c-5bba-11f0-a661-d31dfd7a8beb; assortmentStoreId=3081; hasLocData=1; vtc=aPYIvfHl3018JwBw107QQo; io_id=e951e950-8580-4c13-b80e-2644e5ccd232; AID=wmlspartner=0:reflectorid=0000000000000000000000:lastupd=1751951635677; userAppVersion=usweb-1.210.2-06ac62c3275dc327314b860b5a9e1cc542366ff9-7022045r; locGuestData=eyJpbnRlbnQiOiJTSElQUElORyIsImlzRXhwbGljaXQiOmZhbHNlLCJzdG9yZUludGVudCI6IlBJQ0tVUCIsIm1lcmdlRmxhZyI6ZmFsc2UsImlzRGVmYXVsdGVkIjp0cnVlLCJwaWNrdXAiOnsibm9kZUlkIjoiMzA4MSIsInRpbWVzdGFtcCI6MTc1MTk1MTU4MTE4MSwic2VsZWN0aW9uVHlwZSI6IkRFRkFVTFRFRCJ9LCJzaGlwcGluZ0FkZHJlc3MiOnsidGltZXN0YW1wIjoxNzUxOTUxNTgxMTgxLCJ0eXBlIjoicGFydGlhbC1sb2NhdGlvbiIsImdpZnRBZGRyZXNzIjpmYWxzZSwicG9zdGFsQ29kZSI6Ijk1ODI5IiwiZGVsaXZlcnlTdG9yZUxpc3QiOlt7Im5vZGVJZCI6IjMwODEiLCJ0eXBlIjoiREVMSVZFUlkiLCJ0aW1lc3RhbXAiOjE3NTE5NTE1ODExNzYsImRlbGl2ZXJ5VGllciI6bnVsbCwic2VsZWN0aW9uVHlwZSI6IkRFRkFVTFRFRCIsInNlbGVjdGlvblNvdXJjZSI6bnVsbH1dLCJjaXR5IjoiU2FjcmFtZW50byIsInN0YXRlIjoiQ0EifSwicG9zdGFsQ29kZSI6eyJ0aW1lc3RhbXAiOjE3NTE5NTE1ODExODEsImJhc2UiOiI5NTgyOSJ9LCJtcCI6W10sIm1zcCI6eyJub2RlSWRzIjpbXSwidGltZXN0YW1wIjpudWxsfSwibXBEZWxTdG9yZUNvdW50IjowLCJzaG93TG9jYWxFeHBlcmllbmNlIjpmYWxzZSwic2hvd0xNUEVudHJ5UG9pbnQiOmZhbHNlLCJtcFVuaXF1ZVNlbGxlckNvdW50IjowLCJ2YWxpZGF0ZUtleSI6InByb2Q6djI6N2Y4Y2QxZGMtMDI5MC00YjI1LTlkYmYtMDIyOWFmNzU5M2RiIn0%3D; ak_bmsc=E7AEEB7343EEFD492D46A9A449139735~000000000000000000000000000000~YAAQjEw5F1TeQdqXAQAAyD6b9xzacY8q0hwkUB8XE0DmKEPmix9B0L9JMlgigED5UnBD1GHwtiiVTrF5mnNd7g6ww6wwuPVoit6bdEwX4djN+gXJxfxNGNHrIwxaIo6KVDG4NUtuJBqbUVGBNdKmKCneDcvDRgZ6R5mJb07NdEApTv7E/jhdTaR0/9UaBAZ57BdrmBNDgyqC0GM+0/WSbZtXpuolHNj2iJtP7/jWZ5Whz2hPLTsQnYkQkjOpffgKfVONL5gFqqnWLy3X7BNUxPRtqzazIZR9gW9w3PodmVCTCEJlhzc4h8Jb36qK21U1P7CDt5Z9eWvWYDsRPeRG/XkCdxcFbWP2BX7E1cF1f2O3TKnoyakBesMYhivXHdnTa46aMta9ytBgYw==; _intlbu=false; _shcc=US; locDataV3=eyJpc0RlZmF1bHRlZCI6dHJ1ZSwiaXNFeHBsaWNpdCI6ZmFsc2UsImludGVudCI6IlNISVBQSU5HIiwicGlja3VwIjpbeyJub2RlSWQiOiIzMDgxIiwiZGlzcGxheU5hbWUiOiJTYWNyYW1lbnRvIFN1cGVyY2VudGVyIiwiYWRkcmVzcyI6eyJwb3N0YWxDb2RlIjoiOTU4MjkiLCJhZGRyZXNzTGluZTEiOiI4OTE1IEdFUkJFUiBST0FEIiwiY2l0eSI6IlNhY3JhbWVudG8iLCJzdGF0ZSI6IkNBIiwiY291bnRyeSI6IlVTIn0sImdlb1BvaW50Ijp7ImxhdGl0dWRlIjozOC40ODI2NzcsImxvbmdpdHVkZSI6LTEyMS4zNjkwMjZ9LCJzY2hlZHVsZWRFbmFibGVkIjp0cnVlLCJ1blNjaGVkdWxlZEVuYWJsZWQiOnRydWUsInN0b3JlSHJzIjoiMDY6MDAtMjM6MDAiLCJhbGxvd2VkV0lDQWdlbmNpZXMiOlsiQ0EiXSwic3VwcG9ydGVkQWNjZXNzVHlwZXMiOlsiUElDS1VQX1NQRUNJQUxfRVZFTlQiLCJQSUNLVVBfSU5TVE9SRSIsIlBJQ0tVUF9DVVJCU0lERSJdLCJ0aW1lWm9uZSI6IkFtZXJpY2EvTG9zX0FuZ2VsZXMiLCJzdG9yZUJyYW5kRm9ybWF0IjoiV2FsbWFydCBTdXBlcmNlbnRlciIsInNlbGVjdGlvblR5cGUiOiJERUZBVUxURUQifV0sInNoaXBwaW5nQWRkcmVzcyI6eyJsYXRpdHVkZSI6MzguNDc0OCwibG9uZ2l0dWRlIjotMTIxLjM0MzksInBvc3RhbENvZGUiOiI5NTgyOSIsImNpdHkiOiJTYWNyYW1lbnRvIiwic3RhdGUiOiJDQSIsImNvdW50cnlDb2RlIjoiVVNBIiwiZ2lmdEFkZHJlc3MiOmZhbHNlLCJ0aW1lWm9uZSI6IkFtZXJpY2EvTG9zX0FuZ2VsZXMiLCJhbGxvd2VkV0lDQWdlbmNpZXMiOlsiQ0EiXX0sImFzc29ydG1lbnQiOnsibm9kZUlkIjoiMzA4MSIsImRpc3BsYXlOYW1lIjoiU2FjcmFtZW50byBTdXBlcmNlbnRlciIsImludGVudCI6IlBJQ0tVUCJ9LCJpbnN0b3JlIjpmYWxzZSwiZGVsaXZlcnkiOnsibm9kZUlkIjoiMzA4MSIsImRpc3BsYXlOYW1lIjoiU2FjcmFtZW50byBTdXBlcmNlbnRlciIsImFkZHJlc3MiOnsicG9zdGFsQ29kZSI6Ijk1ODI5IiwiYWRkcmVzc0xpbmUxIjoiODkxNSBHRVJCRVIgUk9BRCIsImNpdHkiOiJTYWNyYW1lbnRvIiwic3RhdGUiOiJDQSIsImNvdW50cnkiOiJVUyJ9LCJnZW9Qb2ludCI6eyJsYXRpdHVkZSI6MzguNDgyNjc3LCJsb25naXR1ZGUiOi0xMjEuMzY5MDI2fSwidHlwZSI6IkRFTElWRVJZIiwic2NoZWR1bGVkRW5hYmxlZCI6ZmFsc2UsInVuU2NoZWR1bGVkRW5hYmxlZCI6ZmFsc2UsImFjY2Vzc1BvaW50cyI6W3siYWNjZXNzVHlwZSI6IkRFTElWRVJZX0FERFJFU1MifV0sImlzRXhwcmVzc0RlbGl2ZXJ5T25seSI6ZmFsc2UsImFsbG93ZWRXSUNBZ2VuY2llcyI6WyJDQSJdLCJzdXBwb3J0ZWRBY2Nlc3NUeXBlcyI6WyJERUxJVkVSWV9BRERSRVNTIl0sInRpbWVab25lIjoiQW1lcmljYS9Mb3NfQW5nZWxlcyIsInN0b3JlQnJhbmRGb3JtYXQiOiJXYWxtYXJ0IFN1cGVyY2VudGVyIiwic2VsZWN0aW9uVHlwZSI6IkRFRkFVTFRFRCJ9LCJpc2dlb0ludGxVc2VyIjpmYWxzZSwibXBEZWxTdG9yZUNvdW50IjowLCJyZWZyZXNoQXQiOjE3NTIyMjc0Mzc1NDEsInZhbGlkYXRlS2V5IjoicHJvZDp2Mjo3ZjhjZDFkYy0wMjkwLTRiMjUtOWRiZi0wMjI5YWY3NTkzZGIifQ%3D%3D; isoLoc=IN_OR_t3; xpth=x-o-mart%2BB2C~x-o-mverified%2Bfalse; xpa=-_KqT|2AB62|3VCVY|6hTh8|7XCSt|AN-Dk|BqY9i|EFPmM|ETuyN|G0ROS|GW6w7|IYZYN|K8BAp|KtKpx|L-qUF|MEjTk|W-XGf|WzSD0|X7Id_|ZkC_9|bPGbe|dIdkZ|eewhX|fXtQf|fdm-7|jM1ax|kI9bH|kcy7R|pN4Kz|vQyLF|vRor3|x0fzo|yHgrp|z0vMH; exp-ck=6hTh817XCSt2AN-Dk1BqY9i1EFPmM1G0ROSgGW6w72K8BAp1KtKpx1L-qUF1MEjTk1W-XGf1ZkC_91bPGbe2dIdkZ1eewhX2fXtQf1fdm-71kI9bH2kcy7R2pN4Kz1vQyLF1x0fzo1yHgrp1; pxcts=31390421-5e10-11f0-9841-f6179707d0a8; auth=MTAyOTYyMDE4mzOIMlPBlwzdprgRqWXJ9ZZqqEGPDGbDaCv31eVu%2BMLUPeJw%2B2DNKjLwWa83akrl0eFhdaZ5YS8yJ2bGI3W%2BRSG1ogAb%2FS57eOd1uWuxtcKO8%2BgWPmwn%2Fyx1o2RajHeU767wuZloTfhm7Wk2KcjygjFwIZIekXC4wlSRgDWHtlyE9tSxjpc3kZUokwqJMv6Xm1HDOdmNX0wYsJAAZE2IAjiSTyFyy36jRRE8gF5iKkgUMk70P8glgOEpLOprhDfMWpzMbgzyqWg6MoSOREDGWmuEytg1sAimdeaAKamVn1aO92juEs1rw%2FbLsWORD3Mhs9u0jquSkL3ufN1uPQ3CwRYjZaTEEG0CRLiB7D0xkvMX2c2JT%2F%2BidiOG%2ByUhM6tT2awISllY6cy%2Fppai0Y6RxJE5WBBdZBCyKnCQAR7o6eg%3D; bstc=QbE1BAj96J4794BRhYeUTA; _astc=47697462a9012e21ea7d39ac03c5e031; xpm=1%2B1752208408%2BaPYIvfHl3018JwBw107QQo~%2B0; _px3=4cd8c4750860da158196664bfcc93882dc7cf7ab97a11bc909b767f4bdebd046:PRNzGwuavUObfK6GLxoiky+YoJC2nLlPfgNiYYb5vJkMbUxtJPxA8Fgmul12CQgzcagdLRYJlKf0OZtPyz8KSw==:1000:nUULt/HxqYBo4j+Xzpto7PBeZ3Nb07YevSL3B4zBQHM2Bs9ikzQVqA+UgvizD+mOuFSJf8sARIub96iJVyjkwD3YbQ8ocq8tNyK+DlHyXZjvU86SImN0lIGcO+ZlRDxyfX+jdJ5G9d3ZfvuwiXiEBszMmqplv9F8342S+1cOc1qjWm3kh2BI7DzurRDAEtqLPGkLe1k1lAQxorQXintFFR7xhrPgFWLFiv5kjN0mWkQ=; bm_mi=EEBE9A56D94A13D973C7DDD9E214293F~YAAQlUw5FyKTQcuXAQAA2wfD9xxjcw24PH/CpW9BuX6wEx0DDzSXao+ruK5sk5C8jglIbjcouVLVCDpg6cKXm+hWILMAV9wi4ijpEoybWVohUcx6cxrnwZp/OPFuG99/5GN8zHiRseXKItOiYCEa21ESxeLLZCZ9jf2TS4RkbA8X0Xgf7bUW7yOursE3B9X5I9+JrwXPs4lPDCiOjs0/0GM7KIdtMdG9W52gxZjfKn7jiyMJxM7dLGgs2dqZvsGjqrWXupdWRv48WfFvjzDeC/24QQ81UBqgfFtVwuufGGnc4v7ms3UA9/ZCpyqAZjSqW1n1nA==~1; _pxde=572e85f6d57142bd8674f6cf778ab7f0c84f7c755b3a9e5302518253ef8d286e:eyJ0aW1lc3RhbXAiOjE3NTIyMDg0NDQxMTB9; com.wm.reflector="reflectorid:0000000000000000000000@lastupd:1752208444000@firstcreate:1751951635677"; xptwj=uz:ec433c0a7f0ddaa88f93:jZp6yrwoRjRlysFhPW+sBcfrS6lz4849nGwZZMA/Q9zUa4b3j8XdrdDdyjqziLxYHPv4JHmwRDXOgp9/pWttXabNUAZbbXYXe7jWHF80hWvjsG+bYfK08OwOB+/7twDwBS4kkcOA1E1xcVb8xIzDefRlrCHRNBzczO5DxrpLZAIC8z9QGMzpVph5; akavpau_p2=1752209045~id=d4946b90f5703443a579149ae700dd18; xptc=_m%2B9~assortmentStoreId%2B3081; xptwg=4228222143:13333492A62B300:2F1005B:C32A7EF5:5010C152:D82FBBD5:; TS012768cf=01acc19d4bbd43e3ddbd6d18fce728f5971bada981f66dc8eca6936c898798ac2137b891c83598ac665b5036f8e565dac49cc8bf27; TS01a90220=01acc19d4bbd43e3ddbd6d18fce728f5971bada981f66dc8eca6936c898798ac2137b891c83598ac665b5036f8e565dac49cc8bf27; TS2a5e0c5c027=08e69005abab2000ef808eb9c474d12c8b9dd7bad5e2a06303eef552a4d1f198b2366461626662b1083570d77f1130008636ecb2e46dee8de2ac34d0e5d5dcd83c39582efdbf49ddbc070d6e8566a694d56e5134f8f28f53e24f75455160bba2; if_id=FMEZARSFDeO8GDhMQ3Ef5KtuyozPAXg9yzxq3TmRQKDQvqOCKDwKLzkwrYcGrqqF1bI7DIUsmAshXvBrDhlCZi+5/99Pwq4RtHx1+J7NKpSDZ0tIIuYA/78Qfweiq8geuSm3eC1h7COJZdQyMUMunf9PMFb1FbF3rjImr1kYBJkIS+2nMqyeOB6AGdOkZxYavo6rE1GRCei94kl3AX+1Ky16IPbazfDTPT/8LhP6VpVHpNdqQxB+2uPEVZ3f7e+Xf50/ZZia4BxGMyLc6TI869azwsGqI9tWJ7WLZslA0L41DFKiLbs/4K5RgZtFk4XxYPbEqY7RZ8Jy2P/eomMR84pDGAg=; TS016ef4c8=0184e47faf5c4f2bfd37c92835490c2f2072b1c32a5851ddefbfc3ec6212986ce4adb99083cae5e886176ce25e3e88c4ab81067318; TS01f89308=0184e47faf5c4f2bfd37c92835490c2f2072b1c32a5851ddefbfc3ec6212986ce4adb99083cae5e886176ce25e3e88c4ab81067318; TS8cb5a80e027=08d4a8f3d2ab2000069d297caf40c74cb69cf36e60c203de12e3545dc2ea3af763415abfd4647a6a08df55d64011300030edc551faa334fa2453e23b5c99dae3f21ffc99eff452403d92a577f6fff08d9e216e7ae3029c1a759c80c7fb844daf; bm_sv=D0F8EC782866BC89A2A46D6C90F3577E~YAAQlUw5F4+cQcuXAQAAFyXD9xzsDCXACH/b1rlIUKHoYpGIIKRTqtHnhYjIU6wm622MbNzR9QfiYl6lrAGDLr0t+w2Tf1c0NsTmYoh+AmfMbOIqH4Y6lFk6Cg3JcSOLmAF3sJdv0GhSTFnS7Nti7qTnmvB4qTlRfyp6HiLErwNmNcYz6svou25oxS595sJJJzHw+AyEG5YFNiwjB+ofh1qgcxKjHYzheZhX2oi6LRmFNrehIqm8DgmImPcISOc3f+Q=~1'
//   );
//   // Add other headers...

//   try {
//     const internalResponse = await fetch(internalUrl.toString(), {
//       headers,
//       redirect: "manual",
//     });

//     return new Response(internalResponse.body, {
//       status: internalResponse.status,
//       headers: internalResponse.headers,
//     });
//   } catch (error) {
//     const err = error instanceof Error ? error : new Error("Unknown error");
//     return NextResponse.json(
//       { error: "Proxy failed", details: err.message },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetEndpoint = searchParams.get("endpoint");
  const query = searchParams.get("query");

  if (!targetEndpoint) {
    return NextResponse.json(
      { error: "Missing target endpoint" },
      { status: 400 }
    );
  }

  // Construct internal URL
  const internalUrl = new URL(`/api/${targetEndpoint}`, request.nextUrl.origin);
  if (query) {
    internalUrl.searchParams.set("query", query);
  }
  const getRandomReferer = (): string => {
    const referers = [
      "https://www.google.com/",
      "https://duckduckgo.com/",
      "https://www.bing.com/",
      "https://search.yahoo.com/",
      "https://www.ecosia.org/",
      "https://www.startpage.com/",
      "https://searx.org/",
      "https://www.qwant.com/",
      "https://yandex.com/",
      "https://www.baidu.com/",
    ];
    return referers[Math.floor(Math.random() * referers.length)];
  };
  const getRandomUserAgent = (): string => {
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  };
  try {
    const headers = new Headers();
    headers.set("User-Agent", getRandomUserAgent());
    headers.set("Referer", getRandomReferer());
    headers.set(
      "Cookie",
      '_pxvid=37421428-5bba-11f0-b946-c403d4cbe213; adblocked=false; ACID=7f8cd1dc-0290-4b25-9dbf-0229af7593db; _m=9; hasACID=true; abqme=true; _pxhd=8a6bfa00bfedac994690b16cbea78451d814eb39636d5b5062ef113ae4b2aac1:3773629c-5bba-11f0-a661-d31dfd7a8beb; assortmentStoreId=3081; hasLocData=1; vtc=aPYIvfHl3018JwBw107QQo; io_id=e951e950-8580-4c13-b80e-2644e5ccd232; AID=wmlspartner=0:reflectorid=0000000000000000000000:lastupd=1751951635677; userAppVersion=usweb-1.210.2-06ac62c3275dc327314b860b5a9e1cc542366ff9-7022045r; locGuestData=eyJpbnRlbnQiOiJTSElQUElORyIsImlzRXhwbGljaXQiOmZhbHNlLCJzdG9yZUludGVudCI6IlBJQ0tVUCIsIm1lcmdlRmxhZyI6ZmFsc2UsImlzRGVmYXVsdGVkIjp0cnVlLCJwaWNrdXAiOnsibm9kZUlkIjoiMzA4MSIsInRpbWVzdGFtcCI6MTc1MTk1MTU4MTE4MSwic2VsZWN0aW9uVHlwZSI6IkRFRkFVTFRFRCJ9LCJzaGlwcGluZ0FkZHJlc3MiOnsidGltZXN0YW1wIjoxNzUxOTUxNTgxMTgxLCJ0eXBlIjoicGFydGlhbC1sb2NhdGlvbiIsImdpZnRBZGRyZXNzIjpmYWxzZSwicG9zdGFsQ29kZSI6Ijk1ODI5IiwiZGVsaXZlcnlTdG9yZUxpc3QiOlt7Im5vZGVJZCI6IjMwODEiLCJ0eXBlIjoiREVMSVZFUlkiLCJ0aW1lc3RhbXAiOjE3NTE5NTE1ODExNzYsImRlbGl2ZXJ5VGllciI6bnVsbCwic2VsZWN0aW9uVHlwZSI6IkRFRkFVTFRFRCIsInNlbGVjdGlvblNvdXJjZSI6bnVsbH1dLCJjaXR5IjoiU2FjcmFtZW50byIsInN0YXRlIjoiQ0EifSwicG9zdGFsQ29kZSI6eyJ0aW1lc3RhbXAiOjE3NTE5NTE1ODExODEsImJhc2UiOiI5NTgyOSJ9LCJtcCI6W10sIm1zcCI6eyJub2RlSWRzIjpbXSwidGltZXN0YW1wIjpudWxsfSwibXBEZWxTdG9yZUNvdW50IjowLCJzaG93TG9jYWxFeHBlcmllbmNlIjpmYWxzZSwic2hvd0xNUEVudHJ5UG9pbnQiOmZhbHNlLCJtcFVuaXF1ZVNlbGxlckNvdW50IjowLCJ2YWxpZGF0ZUtleSI6InByb2Q6djI6N2Y4Y2QxZGMtMDI5MC00YjI1LTlkYmYtMDIyOWFmNzU5M2RiIn0%3D; ak_bmsc=E7AEEB7343EEFD492D46A9A449139735~000000000000000000000000000000~YAAQjEw5F1TeQdqXAQAAyD6b9xzacY8q0hwkUB8XE0DmKEPmix9B0L9JMlgigED5UnBD1GHwtiiVTrF5mnNd7g6ww6wwuPVoit6bdEwX4djN+gXJxfxNGNHrIwxaIo6KVDG4NUtuJBqbUVGBNdKmKCneDcvDRgZ6R5mJb07NdEApTv7E/jhdTaR0/9UaBAZ57BdrmBNDgyqC0GM+0/WSbZtXpuolHNj2iJtP7/jWZ5Whz2hPLTsQnYkQkjOpffgKfVONL5gFqqnWLy3X7BNUxPRtqzazIZR9gW9w3PodmVCTCEJlhzc4h8Jb36qK21U1P7CDt5Z9eWvWYDsRPeRG/XkCdxcFbWP2BX7E1cF1f2O3TKnoyakBesMYhivXHdnTa46aMta9ytBgYw==; _intlbu=false; _shcc=US; locDataV3=eyJpc0RlZmF1bHRlZCI6dHJ1ZSwiaXNFeHBsaWNpdCI6ZmFsc2UsImludGVudCI6IlNISVBQSU5HIiwicGlja3VwIjpbeyJub2RlSWQiOiIzMDgxIiwiZGlzcGxheU5hbWUiOiJTYWNyYW1lbnRvIFN1cGVyY2VudGVyIiwiYWRkcmVzcyI6eyJwb3N0YWxDb2RlIjoiOTU4MjkiLCJhZGRyZXNzTGluZTEiOiI4OTE1IEdFUkJFUiBST0FEIiwiY2l0eSI6IlNhY3JhbWVudG8iLCJzdGF0ZSI6IkNBIiwiY291bnRyeSI6IlVTIn0sImdlb1BvaW50Ijp7ImxhdGl0dWRlIjozOC40ODI2NzcsImxvbmdpdHVkZSI6LTEyMS4zNjkwMjZ9LCJzY2hlZHVsZWRFbmFibGVkIjp0cnVlLCJ1blNjaGVkdWxlZEVuYWJsZWQiOnRydWUsInN0b3JlSHJzIjoiMDY6MDAtMjM6MDAiLCJhbGxvd2VkV0lDQWdlbmNpZXMiOlsiQ0EiXSwic3VwcG9ydGVkQWNjZXNzVHlwZXMiOlsiUElDS1VQX1NQRUNJQUxfRVZFTlQiLCJQSUNLVVBfSU5TVE9SRSIsIlBJQ0tVUF9DVVJCU0lERSJdLCJ0aW1lWm9uZSI6IkFtZXJpY2EvTG9zX0FuZ2VsZXMiLCJzdG9yZUJyYW5kRm9ybWF0IjoiV2FsbWFydCBTdXBlcmNlbnRlciIsInNlbGVjdGlvblR5cGUiOiJERUZBVUxURUQifV0sInNoaXBwaW5nQWRkcmVzcyI6eyJsYXRpdHVkZSI6MzguNDc0OCwibG9uZ2l0dWRlIjotMTIxLjM0MzksInBvc3RhbENvZGUiOiI5NTgyOSIsImNpdHkiOiJTYWNyYW1lbnRvIiwic3RhdGUiOiJDQSIsImNvdW50cnlDb2RlIjoiVVNBIiwiZ2lmdEFkZHJlc3MiOmZhbHNlLCJ0aW1lWm9uZSI6IkFtZXJpY2EvTG9zX0FuZ2VsZXMiLCJhbGxvd2VkV0lDQWdlbmNpZXMiOlsiQ0EiXX0sImFzc29ydG1lbnQiOnsibm9kZUlkIjoiMzA4MSIsImRpc3BsYXlOYW1lIjoiU2FjcmFtZW50byBTdXBlcmNlbnRlciIsImludGVudCI6IlBJQ0tVUCJ9LCJpbnN0b3JlIjpmYWxzZSwiZGVsaXZlcnkiOnsibm9kZUlkIjoiMzA4MSIsImRpc3BsYXlOYW1lIjoiU2FjcmFtZW50byBTdXBlcmNlbnRlciIsImFkZHJlc3MiOnsicG9zdGFsQ29kZSI6Ijk1ODI5IiwiYWRkcmVzc0xpbmUxIjoiODkxNSBHRVJCRVIgUk9BRCIsImNpdHkiOiJTYWNyYW1lbnRvIiwic3RhdGUiOiJDQSIsImNvdW50cnkiOiJVUyJ9LCJnZW9Qb2ludCI6eyJsYXRpdHVkZSI6MzguNDgyNjc3LCJsb25naXR1ZGUiOi0xMjEuMzY5MDI2fSwidHlwZSI6IkRFTElWRVJZIiwic2NoZWR1bGVkRW5hYmxlZCI6ZmFsc2UsInVuU2NoZWR1bGVkRW5hYmxlZCI6ZmFsc2UsImFjY2Vzc1BvaW50cyI6W3siYWNjZXNzVHlwZSI6IkRFTElWRVJZX0FERFJFU1MifV0sImlzRXhwcmVzc0RlbGl2ZXJ5T25seSI6ZmFsc2UsImFsbG93ZWRXSUNBZ2VuY2llcyI6WyJDQSJdLCJzdXBwb3J0ZWRBY2Nlc3NUeXBlcyI6WyJERUxJVkVSWV9BRERSRVNTIl0sInRpbWVab25lIjoiQW1lcmljYS9Mb3NfQW5nZWxlcyIsInN0b3JlQnJhbmRGb3JtYXQiOiJXYWxtYXJ0IFN1cGVyY2VudGVyIiwic2VsZWN0aW9uVHlwZSI6IkRFRkFVTFRFRCJ9LCJpc2dlb0ludGxVc2VyIjpmYWxzZSwibXBEZWxTdG9yZUNvdW50IjowLCJyZWZyZXNoQXQiOjE3NTIyMjc0Mzc1NDEsInZhbGlkYXRlS2V5IjoicHJvZDp2Mjo3ZjhjZDFkYy0wMjkwLTRiMjUtOWRiZi0wMjI5YWY3NTkzZGIifQ%3D%3D; isoLoc=IN_OR_t3; xpth=x-o-mart%2BB2C~x-o-mverified%2Bfalse; xpa=-_KqT|2AB62|3VCVY|6hTh8|7XCSt|AN-Dk|BqY9i|EFPmM|ETuyN|G0ROS|GW6w7|IYZYN|K8BAp|KtKpx|L-qUF|MEjTk|W-XGf|WzSD0|X7Id_|ZkC_9|bPGbe|dIdkZ|eewhX|fXtQf|fdm-7|jM1ax|kI9bH|kcy7R|pN4Kz|vQyLF|vRor3|x0fzo|yHgrp|z0vMH; exp-ck=6hTh817XCSt2AN-Dk1BqY9i1EFPmM1G0ROSgGW6w72K8BAp1KtKpx1L-qUF1MEjTk1W-XGf1ZkC_91bPGbe2dIdkZ1eewhX2fXtQf1fdm-71kI9bH2kcy7R2pN4Kz1vQyLF1x0fzo1yHgrp1; pxcts=31390421-5e10-11f0-9841-f6179707d0a8; auth=MTAyOTYyMDE4mzOIMlPBlwzdprgRqWXJ9ZZqqEGPDGbDaCv31eVu%2BMLUPeJw%2B2DNKjLwWa83akrl0eFhdaZ5YS8yJ2bGI3W%2BRSG1ogAb%2FS57eOd1uWuxtcKO8%2BgWPmwn%2Fyx1o2RajHeU767wuZloTfhm7Wk2KcjygjFwIZIekXC4wlSRgDWHtlyE9tSxjpc3kZUokwqJMv6Xm1HDOdmNX0wYsJAAZE2IAjiSTyFyy36jRRE8gF5iKkgUMk70P8glgOEpLOprhDfMWpzMbgzyqWg6MoSOREDGWmuEytg1sAimdeaAKamVn1aO92juEs1rw%2FbLsWORD3Mhs9u0jquSkL3ufN1uPQ3CwRYjZaTEEG0CRLiB7D0xkvMX2c2JT%2F%2BidiOG%2ByUhM6tT2awISllY6cy%2Fppai0Y6RxJE5WBBdZBCyKnCQAR7o6eg%3D; bstc=QbE1BAj96J4794BRhYeUTA; _astc=47697462a9012e21ea7d39ac03c5e031; xpm=1%2B1752208408%2BaPYIvfHl3018JwBw107QQo~%2B0; _px3=4cd8c4750860da158196664bfcc93882dc7cf7ab97a11bc909b767f4bdebd046:PRNzGwuavUObfK6GLxoiky+YoJC2nLlPfgNiYYb5vJkMbUxtJPxA8Fgmul12CQgzcagdLRYJlKf0OZtPyz8KSw==:1000:nUULt/HxqYBo4j+Xzpto7PBeZ3Nb07YevSL3B4zBQHM2Bs9ikzQVqA+UgvizD+mOuFSJf8sARIub96iJVyjkwD3YbQ8ocq8tNyK+DlHyXZjvU86SImN0lIGcO+ZlRDxyfX+jdJ5G9d3ZfvuwiXiEBszMmqplv9F8342S+1cOc1qjWm3kh2BI7DzurRDAEtqLPGkLe1k1lAQxorQXintFFR7xhrPgFWLFiv5kjN0mWkQ=; bm_mi=EEBE9A56D94A13D973C7DDD9E214293F~YAAQlUw5FyKTQcuXAQAA2wfD9xxjcw24PH/CpW9BuX6wEx0DDzSXao+ruK5sk5C8jglIbjcouVLVCDpg6cKXm+hWILMAV9wi4ijpEoybWVohUcx6cxrnwZp/OPFuG99/5GN8zHiRseXKItOiYCEa21ESxeLLZCZ9jf2TS4RkbA8X0Xgf7bUW7yOursE3B9X5I9+JrwXPs4lPDCiOjs0/0GM7KIdtMdG9W52gxZjfKn7jiyMJxM7dLGgs2dqZvsGjqrWXupdWRv48WfFvjzDeC/24QQ81UBqgfFtVwuufGGnc4v7ms3UA9/ZCpyqAZjSqW1n1nA==~1; _pxde=572e85f6d57142bd8674f6cf778ab7f0c84f7c755b3a9e5302518253ef8d286e:eyJ0aW1lc3RhbXAiOjE3NTIyMDg0NDQxMTB9; com.wm.reflector="reflectorid:0000000000000000000000@lastupd:1752208444000@firstcreate:1751951635677"; xptwj=uz:ec433c0a7f0ddaa88f93:jZp6yrwoRjRlysFhPW+sBcfrS6lz4849nGwZZMA/Q9zUa4b3j8XdrdDdyjqziLxYHPv4JHmwRDXOgp9/pWttXabNUAZbbXYXe7jWHF80hWvjsG+bYfK08OwOB+/7twDwBS4kkcOA1E1xcVb8xIzDefRlrCHRNBzczO5DxrpLZAIC8z9QGMzpVph5; akavpau_p2=1752209045~id=d4946b90f5703443a579149ae700dd18; xptc=_m%2B9~assortmentStoreId%2B3081; xptwg=4228222143:13333492A62B300:2F1005B:C32A7EF5:5010C152:D82FBBD5:; TS012768cf=01acc19d4bbd43e3ddbd6d18fce728f5971bada981f66dc8eca6936c898798ac2137b891c83598ac665b5036f8e565dac49cc8bf27; TS01a90220=01acc19d4bbd43e3ddbd6d18fce728f5971bada981f66dc8eca6936c898798ac2137b891c83598ac665b5036f8e565dac49cc8bf27; TS2a5e0c5c027=08e69005abab2000ef808eb9c474d12c8b9dd7bad5e2a06303eef552a4d1f198b2366461626662b1083570d77f1130008636ecb2e46dee8de2ac34d0e5d5dcd83c39582efdbf49ddbc070d6e8566a694d56e5134f8f28f53e24f75455160bba2; if_id=FMEZARSFDeO8GDhMQ3Ef5KtuyozPAXg9yzxq3TmRQKDQvqOCKDwKLzkwrYcGrqqF1bI7DIUsmAshXvBrDhlCZi+5/99Pwq4RtHx1+J7NKpSDZ0tIIuYA/78Qfweiq8geuSm3eC1h7COJZdQyMUMunf9PMFb1FbF3rjImr1kYBJkIS+2nMqyeOB6AGdOkZxYavo6rE1GRCei94kl3AX+1Ky16IPbazfDTPT/8LhP6VpVHpNdqQxB+2uPEVZ3f7e+Xf50/ZZia4BxGMyLc6TI869azwsGqI9tWJ7WLZslA0L41DFKiLbs/4K5RgZtFk4XxYPbEqY7RZ8Jy2P/eomMR84pDGAg=; TS016ef4c8=0184e47faf5c4f2bfd37c92835490c2f2072b1c32a5851ddefbfc3ec6212986ce4adb99083cae5e886176ce25e3e88c4ab81067318; TS01f89308=0184e47faf5c4f2bfd37c92835490c2f2072b1c32a5851ddefbfc3ec6212986ce4adb99083cae5e886176ce25e3e88c4ab81067318; TS8cb5a80e027=08d4a8f3d2ab2000069d297caf40c74cb69cf36e60c203de12e3545dc2ea3af763415abfd4647a6a08df55d64011300030edc551faa334fa2453e23b5c99dae3f21ffc99eff452403d92a577f6fff08d9e216e7ae3029c1a759c80c7fb844daf; bm_sv=D0F8EC782866BC89A2A46D6C90F3577E~YAAQlUw5F4+cQcuXAQAAFyXD9xzsDCXACH/b1rlIUKHoYpGIIKRTqtHnhYjIU6wm622MbNzR9QfiYl6lrAGDLr0t+w2Tf1c0NsTmYoh+AmfMbOIqH4Y6lFk6Cg3JcSOLmAF3sJdv0GhSTFnS7Nti7qTnmvB4qTlRfyp6HiLErwNmNcYz6svou25oxS595sJJJzHw+AyEG5YFNiwjB+ofh1qgcxKjHYzheZhX2oi6LRmFNrehIqm8DgmImPcISOc3f+Q=~1'
    ); // Keep minimal
    headers.set("Accept-Encoding", "gzip, deflate, br");
    headers.set(
      "Accept",
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    );
    headers.set("Accept-Language", "en-US,en;q=0.5");
    headers.set("Connection", "keep-alive");
    headers.set("Upgrade-Insecure-Requests", "1");
    headers.set("Sec-Fetch-Dest", "document");
    headers.set("Sec-Fetch-Mode", "navigate");
    headers.set("Sec-Fetch-Site", "cross-site");
    headers.set("Sec-Fetch-User", "?1");
    headers.set("Cache-Control", "max-age=0");
    headers.set("DNT", "1");
    headers.set("Pragma", "no-cache");

    const response = await fetch(internalUrl.toString(), {
      headers,
      redirect: "manual",
    });

    // Handle potential encoding issues
    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        ...Object.fromEntries(response.headers),
      },
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    return NextResponse.json(
      { error: "Proxy failed", details: err.message },
      { status: 500 }
    );
  }
}

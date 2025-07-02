export {};

declare global {
  interface userInfo {
    bind: loginMessage;
    user: userMessage;
  }

  interface userMessage {
    staffname: string;
    memberimg:string;
  }

  interface loginMessage {
    staffname:string;
    stasfTel:number;
    email:number;
    staffid:string ;
    memberimg: string;
    kindid: number;
    memberid: string;
    membername: string;
  }

  interface ApiResponse<T = any> {
    code: number;
    msg: string;
    data: T;
  }

  //articleList 文章列表类型 多处使用

  interface articleList {
    name: string;
    description: string;
    pic: string;
    id: string;
    author: string;
    createTime: string;
  }

  // 文章详情
  interface articleDetail {
    author: number;
    cid: number;
    content: string;
    contentSourceUrl: string;
    createdTime: string;
    description: string;
    digest: null;
    downUrl: string;
    icon: string;
    iconHover: string;
    id: number;
    mediaId: string;
    name: string;
    showCoverPic: string;
    thumbMediaId: null;
    title: string;
    titleImage: string;
    type: string;
    updateTime: string;
    url: string;
  }

  // 广告图片
  interface adver {
    clickCount: number;
    endTime: string;
    id: string;
    name: string;
    note: string;
    orderCount: number;
    pic: string;
    sort: number;
    startTime: string;
    status: number;
    type: number;
    url: null | string;
  }
}

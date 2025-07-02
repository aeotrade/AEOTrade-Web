const commonUploadConfig = {
  server: import.meta.env.VITE_BASE_URL + "/chain/upload",
  fieldName: "file",
  maxFileSize: 4 * 1024 * 1024,
  maxNumberOfFiles: 10,
  meta: {},
  metaWithUrl: false,
  headers: {
    Authorization: "Bearer " + useCookie("token").value,
  },
  withCredentials: false,
  timeout: 30 * 1000,
};

export const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      ...commonUploadConfig,
      allowedFileTypes: ["image/*"],
      customInsert(res, insertFn) {
        const url = res.result;
        insertFn(url, url, url);
      },
    },
    uploadVideo: {
      ...commonUploadConfig,
      allowedFileTypes: ["video/*"],
      customInsert(res, insertFn) {
        const url = res.result;
        const poster = "";
        insertFn(url, poster);
      },
    },
  },
};

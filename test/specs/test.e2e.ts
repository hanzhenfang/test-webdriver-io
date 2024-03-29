import { expect, browser } from "@wdio/globals";

const userInfo = {
  boxname: "pbkfang",
  username: "hzf",
  password: "123qaz",
};

const applist = [
  {
    host: "cloud.lazycat.app.downloader",
    id: "下载器",
  },
  {
    host: "cloud.lazycat.app.ce",
    id: "观影助手",
  },
  {
    host: "cloud.lazycat.app.ocr",
    id: "文字识别",
  },
  {
    host: "cloud.lazycat.app.photo",
    id: "懒猫相册",
  },
  {
    host: "cloud.lazycat.app.video",
    id: "视频播放器",
  },
];

describe("launcher 测试", () => {
  it("test", async () => {
    await browser.url(`https://${userInfo.boxname}.heiyu.space`);
    const title = await browser.getTitle();
    await expect(title).toContain("登录懒猫微服");

    const usernameInput = await $("#username");
    await usernameInput.addValue(userInfo.username);
    const passwordInput = await $("#password");
    await passwordInput.addValue(userInfo.password);
    const submit = await $("#submit");
    await submit.click();
    const url = await browser.getUrl();
    await expect(url).toContain(`${userInfo.boxname}.heiyu.space`);

    await browser.newWindow("https://appstore.pbkfang.heiyu.space");

    await browser.waitUntil(
      () => browser.execute(() => document.readyState === "complete"),
      { timeout: 10e3 }
    );
    const appstoreTitle = await browser.getTitle();
    await expect(appstoreTitle).toContain("懒猫应用商店");

    browser.setupInterceptor();
    browser.expectRequest(
      "POST",
      `https://appstore.${userInfo.boxname}.heiyu.space/cloud.lazycat.apis.sys.PackageManager/Install`,
      400
    );

    for (let i = 0; i < applist.length; i++) {
      const currentApp = applist[i];
      const installBtn = await $(`#${currentApp.id}`);
      // const installBtn = await $("#懒猫相册");
      await expect(installBtn).toBeExisting();
      // await expect(installBtn).toContain("安装");
      await installBtn.click();
    }
    await browser.pause(30000);
  });
});

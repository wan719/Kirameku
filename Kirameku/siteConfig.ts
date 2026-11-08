// siteConfig.ts - 全站配置中心

export const siteConfig = {
  // 网站标题与博主信息
  title: "Wanの小站",
  url: "https://boke.hiromu.top",
  authorName: "Wan",
  bio: "软件工程大三学生，喜欢开发、跑步、游戏，也在探索大模型 Agent。",

  // 头像设置
  avatarUrl: "/images/wan-avatar.png",

  // 背景设置
  useGradient: false,
  themeColors: ["#a18cd1", "#fbc2eb", "#a1c4fd", "#c2e9fb"],
  bgImages: [
    "/images/wan-bg-01.png",
    "/images/wan-bg-02.png",
    "/images/wan-bg-03.png",
    "/images/wan-bg-04.png",
    "/images/wan-bg-05.png",
    "/images/wan-bg-06.png",
    "/images/wan-bg-07.png",
    "/images/wan-bg-08.png",
  ],
  defaultBgImage: "/images/wan-bg-05.png",

  // 默认封面图
  defaultPostCover: "/images/default-cover.jpg",

  // 照片墙预览图
  photoWallImage: "/images/photo-wall.jpg",

  // 云音乐配置（netease：网易云音乐；tencent：QQ 音乐）
  // 填歌单 ID 则自动拉取整个歌单，填歌曲 ID 列表则只播放指定歌曲
  cloudMusicServer: "tencent",
  cloudMusicPlaylistId: "9804321125",  // 歌单 ID（优先）
  cloudMusicIds: [],                     // 歌曲 ID 列表（歌单为空时使用）

  // 后端 API 地址（留空，开发通过 next.config.ts rewrites 代理，生产通过 Nginx 反代）
  apiBaseUrl: "",

  // 社交链接
  social: {
    github: "https://github.com/wan719",
    gitee: "",
    google: "",
    email: "3425446714@qq.com",
    qq: "",
    wechat: "",
  },

  // 站点信息
  buildDate: "2026-05-07T12:00:00",
  footerBadges: [
    { name: "Next.js 15", color: "text-sky-500" },
    { name: "React 19", color: "text-cyan-400" },
    { name: "Tailwind 4", color: "text-teal-400" },
  ],
  icpConfig: {
    name: "",
    link: "https://beian.miit.gov.cn/",
  },
  moeIcpConfig: {
    name: "",
    link: "https://icp.gov.moe/?keyword=20260527",
  },

  // 分类标题
  chatterTitle: "留言",
  chatterDescription: "生活、技术、随想的碎片记录",
};

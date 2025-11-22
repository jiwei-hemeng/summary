import { execSync } from "child_process";
export default function gitHash() {
  const hash = execSync("git rev-parse --short HEAD").toString().trim();
  return {
    name: "git-hash",
    transformIndexHtml(html) {
      return html.replace("</head>", `<meta name="git-hash" content="${hash}"></head>`);
    }
  };
}

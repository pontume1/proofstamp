/* Moralis init code */
const serverUrl = "https://whadvahcmjmt.usemoralis.com:2053/server";
const appId = "c8WBngJ0K5gPr0213acoLO8TGt0fjszjVcYcSlGf";
Moralis.start({ serverUrl, appId });

/* Authentication code */
async function login() {
  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.authenticate({
      provider: "web3Auth",
      clientId: "BG5O86w-R7X7WDqn3HoSurhkmgMBtGYlf_l6YuTL52FeQRSmRj1h6oh4xkMnjCUoYhCaL2p-nFCwzR8NDWfHbwI",
      theme : "light"
    })
      .then(function (user) {
        console.log("logged in user:", user);
        console.log(user.get("ethAddress"));
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
}

document.getElementById("btn-login").onclick = login;
//document.getElementById("btn-logout").onclick = logOut;

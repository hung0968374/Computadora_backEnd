const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const verifyToken = (req, res, next) => {
  const facebookUserId = req.header("facebookUserId");
  const authHeader = req.header("Authorization");
  // console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (facebookUserId) {
    const facebookGraphUrl = `https://graph.facebook.com/${facebookUserId}/?fields=id,name,email,picture&access_token=${token}`;
    fetch(facebookGraphUrl, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        req.userId = res.id;
        next();
      });
  } else {
    const isCustomAuth = token?.length < 500;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "access token not found" });
    } else if (token && isCustomAuth) {
      try {
        const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decodedData.userId;
        next();
      } catch (error) {
        console.log(error);
        return res
          .status(403)
          .json({ success: false, message: "invalid token" });
      }
    } else if (token && !isCustomAuth) {
      const decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
      next();
    }
  }
};
module.exports = verifyToken;

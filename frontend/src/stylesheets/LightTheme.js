export const LightTheme = {
  dark: false,
  // do not delete require for react navigtion to load correctly
  colors:{
    primary: "#438707",
    background: "rgb(255, 255, 255)",
    card: "rgb(255, 255, 255)",
    text: "rgb(28, 28, 30)",
    border: "rgb(255, 255, 255)",
    iconColor: "#7d7f7e",
     // do not delete require for react navigtion to load correctly
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 50,
    fontWeight: "bold",
    margin: 10,
  },
  subtitle: {
    flexDirection: "row",
    marginRight: "40%",
    fontSize: 45,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tagline: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 22,
    fontWeight: "semi-bold",
    marginLeft: 9,
    color: "#7d7f7e",
  },
  textFormat: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 25
  },
  textInput: {
    height: 40,
    borderRadius: 10,
    paddingLeft: 5,
    marginBottom: 5,
    borderColor: "#e6e6e6",
    borderWidth: 0.5,
    width: "75%",
    fontSize:18
  },
  profilePicMobile: {
    width: 37,
    height: 37,
    marginRight: 7,
    overflow: "hidden",
    borderRadius: 20,
  },
  profilePicWeb: {
    width: 40,
    height: 40,
    marginRight: 5,
    borderRadius: "50%",
  },
  blobImage: {
    flexDirection: "row-reverse",
    height: "85%",
    width: "85%",
    resizeMode: "contain",
    transform: [{ rotate: "-30deg" }],
    position: "absolute",
    top: -230,
    right: -105,
  },
  loginBtn: {
    borderRadius: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    minWidth: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  signupBtn: {
    borderRadius: 5,
    borderColor: "#B5EB89",
    borderRadius: 10,
    borderWidth: 1,
    minWidth: "80%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
}
};

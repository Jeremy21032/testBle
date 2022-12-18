import React from "react";
import { StyleSheet } from "react-native";
import { Icon } from "@rneui/base";

const FONTAWESOME = "font-awesome";
const FONT_AWESOME_5 = "font-awesome-5";
const FONTISTO = "fontisto";
const IONICON = "ionicon";
const ENTYPO = "entypo";
const OCTICON = "octicon";
const ANTDESIGN = "antdesign";
const MATERIAL_COMUNITY = "material-community";
const deleteIcon = { type: FONTAWESOME, name: "trash" };
const searchIcon = { type: FONTISTO, name: "search" };
const checkIcon = { type: OCTICON, name: "check-circle-fill" };
const passwordIcon = { type: ANTDESIGN, name: "eye" };
const downloadIcon = { type: ANTDESIGN, name: "clouddownload" };
const backIcon = { type: IONICON, name: "arrow-back-circle-sharp" };
const editIcon = { type: ENTYPO, name: "edit" };
const addressIcon = { type: FONTISTO, name: "map-marker-alt" };
const userIcon = { type: FONT_AWESOME_5, name: "user-alt" };
const listIcon = { type: MATERIAL_COMUNITY, name: "clipboard-search-outline" };
const syncIcon = { type: MATERIAL_COMUNITY, name: "cloud-refresh" };
const productIcon = { type: ANTDESIGN, name: "dropbox" };
const sendIcon = { type: IONICON, name: "send" };
const reloadIcon = { type: IONICON, name: "ios-reload" };

const Icons = ({
  address,
  eliminar,
  buscar,
  check,
  color,
  size,
  style,
  password,
  back,
  edit,
  user,
  list,
  sync,
  download,
  product,
  send,
  reload,
}) => {
  let icon = deleteIcon;
  if (eliminar) {
    icon = deleteIcon;
  }
  if (address) {
    icon = addressIcon;
  }
  if (buscar) {
    icon = searchIcon;
  }
  if (check) {
    icon = checkIcon;
  }
  if (password) {
    icon = passwordIcon;
  }
  if (back) {
    icon = backIcon;
  }
  if (edit) {
    icon = editIcon;
  }
  if (user) {
    icon = userIcon;
  }
  if (list) {
    icon = listIcon;
  }
  if (sync) {
    icon = syncIcon;
  }
  if (product) {
    icon = productIcon;
  }
  if (send) {
    icon = sendIcon;
  }
  if (reload) {
    icon = reloadIcon;
  }
  if (download) icon = downloadIcon;
  return (
    <Icon
      size={size ? size : 30}
      type={icon.type}
      name={icon.name}
      color={color ? color : "black"}
      style={[style, styles.icon]}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    marginHorizontal: 5,
  },
});

export default Icons;

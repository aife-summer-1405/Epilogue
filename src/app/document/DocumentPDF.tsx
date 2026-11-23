/* eslint-disable */

import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { toJalaali } from "jalaali-js";
import { FC } from "react";
import { IHousesDetail, IUserDetail } from "./documentItem";

interface DocumentPdfProps {
  houseDetail: IHousesDetail;
  userDetail: IUserDetail;
  today: Date;
  buyerSignature: string;
}
const DocumentPdf: FC<DocumentPdfProps> = ({
  houseDetail,
  userDetail,
  today,
  buyerSignature,
}) => {
  const toPersianDate = (date: Date): string => {
    const j = toJalaali(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );
    return `${j.jy}/${String(j.jm).padStart(2, "0")}/${String(j.jd).padStart(
      2,
      "0",
    )}`;
  };
  Font.register({
    family: "IranSans",
    src: "/fonts/Vazirmatn-Medium.ttf",
  });

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: "IranSans",
      fontSize: 12,
      lineHeight: 1.5,
    },
    header: {
      fontSize: 18,
      textAlign: "center",
      marginBottom: 20,
      fontWeight: "bold",
      paddingBottom: 10,
    },
    section: {
      marginBottom: 15,
      flexDirection: "row",
      gap: "16px",
      width: "100%",
      justifyContent: "space-between",
      textAlign: "right",
    },
    sectionItem: {
      flexDirection: "column",
      gap: "6px",
      width: "100%",
      textAlign: "right",
    },
    signatureSection: {
      marginTop: 30,
      flexDirection: "row",
      justifyContent: "space-around",
      paddingTop: 20,
    },
    signatureBox: {
      width: "45%",
      alignItems: "center",
      padding: 10,
      height: 80,
    },
    signatureImage: { width: 150, height: 100, marginTop: 5 },
    signatureText: { fontSize: 10, marginTop: 5 },
    footer: {
      position: "absolute",
      bottom: 30,
      left: 40,
      right: 40,
      textAlign: "center",
      fontSize: 10,
      color: "#666",
    },
  });
  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <View style={styles.header}>
          <Text>امضای دو طرفین قرارداد</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionItem}>
            <View>
              <Text>
                نام و نام خانوداگی :{" "}
                {userDetail.user.firstName + " " + userDetail.user.lastName}
              </Text>
            </View>
            <View>
              <Text>کد ملی : {userDetail.user.id}3345334</Text>
            </View>
            <View>
              <Text>تاریخ : {toPersianDate(today)}</Text>
            </View>
          </View>
          <View style={styles.sectionItem}>
            <View>
              <Text>نام و نام خانوداگی : {houseDetail.sellerName}</Text>
            </View>
            <View>
              <Text>کد ملی : {houseDetail.sellerId}3345334</Text>
            </View>
            <View>
              <Text>تاریخ : {toPersianDate(today)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 14, marginBottom: 5 }}>امضای فروشنده</Text>
            <Text>
              <Image
                style={styles.signatureImage}
                src={"/assets/Dashboard/fakeSig.jpg"}
              />
            </Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 14, marginBottom: 5 }}>امضای خریدار</Text>
            {buyerSignature ? (
              <Image style={styles.signatureImage} src={buyerSignature} />
            ) : (
              <Text>امضا موجود نیست</Text>
            )}
          </View>
        </View>
        <View style={styles.footer}>
          <Text>
            این سند به صورت الکترونیکی پیاده شده و دارای جنبه قانونی می باشد
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default DocumentPdf;

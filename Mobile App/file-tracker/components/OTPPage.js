import React, { useState } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { Button, TextInput, Subheading } from "react-native-paper";
import DropdownAlert from "react-native-dropdownalert";

export default function OTPPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enterEmail, setEnterEmail] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600);
  const [resend, setResend] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(null);
  const [timeInterval, setTimeInterval] = useState(null);

  return (
    <>
      {!enterEmail && (
        <Text
          style={styles.back}
          onPress={() => {
            setEnterEmail(true);
            clearTimeout(resendTimeout);
            setResendTimeout(null);
            clearInterval(timeInterval);
            setTimeInterval(null);
            setTimeLeft(600);
          }}
        >
          Back
        </Text>
      )}

      <View
        style={{
          paddingTop: 160 - (enterEmail ? 0 : 50),
          flex: 1,
          alignItems: "center",
          padding: 8,
        }}
      >
        <Image
          style={styles.logo}
          source={require("../assets/adaptive-icon.png")}
        />

        <Text style={styles.paragraph}>File Tracker</Text>

        {enterEmail && (
          <>
            <TextInput
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCompleteType="email"
              autoCapitalize="none"
              style={styles.email}
              label="Personal Email Address"
              mode="outlined"
              theme={{
                colors: { primary: "black", underlineColor: "transparent" },
              }}
              onChangeText={(txt) => {
                setEmail(txt);
              }}
              value={email}
            />

            <Button
              color="black"
              loading={loading}
              disabled={loading}
              style={styles.login_btn}
              mode="contained"
              onPress={async () => {
                if (
                  !/^[a-zA-Z0-9+_\.-]+@[a-zA-Z0-9\.-]+\.[a-zA-Z]+$/.test(email)
                ) {
                  this.dropDown.alertWithType(
                    "error",
                    "Enter email address",
                    "The provided email does not look like one"
                  );
                  return 0;
                }
                setLoading(true);
                let formData = new FormData();
                formData.append("email", email);
                let error = null;
                try {
                  error = await fetch("http://192.168.1.4:5000/generateOTP", {
                    method: "POST",
                    body: formData,
                    headers: {
                      "content-type": "multipart/form-data",
                    },
                  });
                  error = await error.json();
                } catch (e) {
                  this.dropDown.alertWithType(
                    "error",
                    "Network Error",
                    "Some error occurred"
                  );
                  setLoading(false);
                  return 0;
                }
                if (error.error) {
                  this.dropDown.alertWithType(
                    "error",
                    "Server Error",
                    "Some error occurred"
                  );
                  setLoading(false);
                  return 0;
                }
                setLoading(false);
                this.dropDown.alertWithType(
                  "success",
                  "OTP sent!",
                  "Check your email for OTP"
                );
                setEnterEmail(false);
                setResend(false);
                setTimeInterval(
                  setInterval(() => {
                    setTimeLeft((prevtimeLeft) => {
                      if (prevtimeLeft == 1) {
                        setEnterEmail(true);
                      }
                      return prevtimeLeft - 1;
                    });
                  }, 1000)
                );
                setResendTimeout(setTimeout(() => setResend(true), 30000));
              }}
            >
              Get OTP
            </Button>
          </>
        )}

        {!enterEmail && (
          <>
            <TextInput
              onChangeText={(txt) => (this.otp = txt)}
              keyboardType="numeric"
              style={styles.email}
              label="Enter OTP"
              mode="outlined"
              theme={{
                colors: { primary: "black", underlineColor: "transparent" },
              }}
            />

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <Button
                icon="reload"
                disabled={!resend}
                onPress={async () => {
                  setResend(false);
                  let formData = new FormData();
                  formData.append("email", email);
                  let error = null;
                  try {
                    error = await fetch("http://192.168.1.4:5000/generateOTP", {
                      method: "POST",
                      body: formData,
                      headers: {
                        "content-type": "multipart/form-data",
                      },
                    });
                    error = await error.json();
                  } catch (e) {
                    this.dropDown.alertWithType(
                      "error",
                      "Network Error",
                      "Some error occurred"
                    );
                    setResend(true);
                    return 0;
                  }
                  if (error.error) {
                    this.dropDown.alertWithType(
                      "error",
                      "Server Error",
                      "Some error occurred"
                    );
                    setResend(true);
                    return 0;
                  }
                  this.dropDown.alertWithType(
                    "success",
                    "OTP sent!",
                    "Check your email for OTP"
                  );
                  setResendTimeout(setTimeout(() => setResend(true), 30000));
                  setTimeLeft(600);
                }}
              >
                Resend
              </Button>
              <Text
                style={{
                  fontSize: 15,
                  marginTop: 9,
                  marginLeft: 90,
                  color: "gray",
                }}
              >
                Time left: {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                {String(timeLeft % 60).padStart(2, "0")}
              </Text>
            </View>

            <Button
              loading={loading}
              disabled={loading}
              style={styles.login_btn}
              mode="contained"
              onPress={async () => {
                setLoading(true);
                let formData = new FormData();
                formData.append("email", email);
                formData.append("otp", this.otp);
                let match = null;
                try {
                  match = await fetch("http://192.168.1.4:5000/verifyOTP", {
                    method: "POST",
                    body: formData,
                    headers: {
                      "content-type": "multipart/form-data",
                    },
                  });
                  match = await match.json();
                } catch (e) {
                  this.dropDown.alertWithType(
                    "error",
                    "Network Error",
                    "Some error occurred"
                  );
                  setLoading(false);
                  return 0;
                }
                if (match.error) {
                  this.dropDown.alertWithType(
                    "error",
                    "Server Error",
                    "Some error occurred"
                  );
                  setLoading(false);
                  return 0;
                }
                if (match.match) {
                  this.dropDown.alertWithType(
                    "success",
                    "Authentication Successful",
                    "OTP matched successfully"
                  );
                  setLoading(false);
                  return 0;
                }
                this.dropDown.alertWithType(
                  "error",
                  "Authentication Unsuccessful",
                  "OTP does not match"
                );
                setLoading(false);
                return 0;
              }}
            >
              Login
            </Button>
          </>
        )}
      </View>
      <DropdownAlert ref={(ref) => (this.dropDown = ref)} />
    </>
  );
}

const styles = StyleSheet.create({
  back: {
    marginTop: 30,
    marginLeft: 30,
    fontSize: 18,
    height: 20,
  },
  login_btn: {
    padding: 5,
    marginTop: 20,
  },
  email: {
    marginTop: 80,
    width: "80%",
    backgroundColor: "white",
    fontSize: 20,
    padding: 5,
    paddingEnd: 20,
    paddingStart: 20,
  },
  logo: {
    height: 100,
    width: 100,
  },
  paragraph: {
    margin: 24,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
});

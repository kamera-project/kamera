import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { useEffect, useState } from "react";
import { Alert, Dimensions, FlatList, Modal, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Image, Text } from "react-native";
import MoveToCamera from "../components/GalleryFooter/MoveToCamera";
import BackBtn from "../components/GalleryFooter/BackBtn";
import DeletePhoto from "../components/GalleryFooter/DeletePhoto";

const numColumns = 3;
const imageSize = Dimensions.get('window').width / numColumns;

export default function GalleryScreen({ visible, onClose }) {
  const [photos, setPhotos] = useState([]);
  const [selectedUri, setSelectedUri] = useState(null);
  const [isSingleView, setIsSingleView] = useState(false);

  const bringPhotos = async () => {
    try {
      const albumPhotos = await CameraRoll.getPhotos({
        first: 100,
        assetType: "Photos",
      });
      const images = albumPhotos.edges.map((edge) => edge.node.image);
      setPhotos(images);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await CameraRoll.deletePhotos([selectedUri]);
      Alert.alert("삭제 완료", "사진이 삭제되었습니다.");
      setSelectedUri(null);
      setIsSingleView(false);
      bringPhotos();
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  useEffect(() => {
    if (visible) {
      bringPhotos();
      setIsSingleView(false);
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        {isSingleView ? (
          <View style={{ flex: 1 }}>
            <Image
              source={{ uri: selectedUri }}
              style={styles.fullImage}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => setIsSingleView(false)}
                style={styles.backButton}
              >
                <BackBtn />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                <DeletePhoto style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.title}>사진 선택</Text>
            <FlatList
              data={photos}
              numColumns={numColumns}
              keyExtractor={(item) => item.uri}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedUri(item.uri);
                    setIsSingleView(true);
                  }}
                >
                  <Image source={{ uri: item.uri }} style={styles.image} />
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </SafeAreaView>

      {!isSingleView && (
        <SafeAreaView>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <MoveToCamera style={styles.icon} />
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  image: {
    width: imageSize,
    height: imageSize,
    margin: 2,
  },
  fullImage: {
    flex: 1,
    resizeMode: "contain",
    backgroundColor: "black",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    padding: 10,
  },
  closeBtn: {
    backgroundColor: "white",
    alignItems: "center",
    padding: 12,
  },
  backButton: {
    padding: 16,
    backgroundColor: "white",
    alignItems: "flex-start",
  },
  backText: {
    fontSize: 16,
    color: "#333",
  },
  deleteButton: {
    backgroundColor: "white",
    padding: 16,
  },
  icon: {
    width: 48,
    height: 48,
    marginHorizontal: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

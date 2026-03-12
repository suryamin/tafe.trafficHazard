import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  content: {
    padding: 20,
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C1C1E",
    textAlign: "center",
    marginTop: 20,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3A3A3C",
    marginBottom: 8,
    marginLeft: 4,
  },
  dropdown: {
    borderColor: "#C7C7CC",
    borderRadius: 10,
    backgroundColor: "#FFF",
  },
  dropdownList: {
    borderColor: "#C7C7CC",
    backgroundColor: "#FFF",
  },
  boxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  box: {
    flex: 1,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: 4,
  },
  boxText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dropdownContainer: {
    borderColor: "#ccc",
    borderRadius: 8,
    width: screenWidth - 12,
    marginLeft: 0,
  },
  dropdownContent: {
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#A2C2E8",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  hazardItem: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 6,
    marginVertical: 4,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, // Android shadow
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hazardTitle: {
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 4,
    paddingRight: 10,
    flex: 1, // allows text to take remaining space next to icon
  },
  hazardSubtitle: { fontSize: 13, color: "#8E8E93", fontWeight: "600" },
  hazardRegion: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  hazardDesc: {
    fontSize: 13,
    color: "#333",
    marginTop: 2,
  },
  hazardTime: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  icon: {
    marginRight: 8,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 100, // Adjust based on your header height
  },
  noDataText: {
    fontSize: 16,
    color: "#757575", // Subtle grey
    textAlign: "center",
    fontFamily: "System", // Use your app's font
    lineHeight: 24,
    fontWeight: "500",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginHorizontal: 5,
  },
  cardTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
  dateButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dateText: {
    fontSize: 14,
    color: "#333",
  },
});

import { ThemeColors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export function createHomeStyles(colors: ThemeColors) {
  return StyleSheet.create({taskList: {
  paddingBottom: 24,
  },

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  date: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "600",
  },

  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
  },

  taskSection: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    flexShrink: 0,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
  },

  taskCount: {
    color: colors.mutedText,
    fontSize: 14,
  },

  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
    marginRight: 14,
  },

  taskContent: {
    flex: 1,
  },

  taskTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },

  taskDetail: {
    color: colors.mutedText,
    fontSize: 13,
  },
  checkboxDone: {
  backgroundColor: colors.primary,
  },

  checkmark: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  taskTitleDone: {
    color: colors.placeholder,
    textDecorationLine: "line-through",
  },

  addTaskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    },

  taskInput: {
    flex: 1,
    height: 52,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 15,
  },

  addButton: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 16,
    marginLeft: 10,
  },

  addButtonText: {
    color: colors.onPrimary,
    fontSize: 28,
    fontWeight: "500",
    lineHeight: 30,
  },
  openModalButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
    flexShrink: 0,
    },

  openModalButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: colors.overlay,
  },

  modalContent: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 24,
  },

  modalTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },

  modalDescription: {
    color: colors.mutedText,
    fontSize: 15,
    marginBottom: 24,
  },

  closeModalButton: {
    backgroundColor: colors.secondarySurface,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  closeModalButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  inputLabel: {
  color: colors.text,
  fontSize: 14,
  fontWeight: "600",
  marginBottom: 8,
  },

  modalInput: {
    minHeight: 52,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 15,
    marginBottom: 18,
  },

  descriptionInput: {
    height: 110,
    paddingTop: 14,
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: colors.secondarySurface,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  cancelButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  confirmButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  confirmButtonText: {
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: "700",
  },

  datePager: {
    height: 100,
    flexGrow: 0,
    flexShrink: 0,
  },

  datePage: {
    height: 82,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 18,
    marginBottom: 18,
    },

  dateWeekday: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
    textTransform: "capitalize",
    marginBottom: 5,
  },

  dateFull: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  deleteButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: colors.dangerSurface,
    marginLeft: 10,
  },

  deleteButtonText: {
    color: colors.danger,
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "500",
  },
  dateInput: {
  minHeight: 52,
  justifyContent: "center",
  backgroundColor: colors.inputBackground,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 14,
  paddingHorizontal: 14,
  marginBottom: 18,
  },

  dateInputText: {
    color: colors.text,
    fontSize: 15,
  },

  datePickerDoneButton: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  datePickerDoneText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },

  headerTop: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
  },

  themeButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
  },

  themeButtonText: {
    color: colors.text,
    fontSize: 22,
  },

  dateNavigation: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 18,
  gap: 10,
  },

  dateNavigationButton: {
    width: 44,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: colors.secondarySurface,
  },

  dateNavigationButtonText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
  },

  todayButton: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },

  todayButtonText: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: "700",
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerIconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: colors.secondarySurface,
  },

  todayIcon: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
  },

  taskStats: {
    alignItems: "flex-end",
    gap: 5,
  },

  completedCount: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
    paddingBottom: 5,
  },

  datePageToday: {
    borderWidth: 2,
    borderColor: colors.primary,
  },

  datePagePast: {
    opacity: 0.5,
  },

  datePageFuture: {
    opacity: 0.72,
  },

  dateTextDimmed: {
    color: colors.mutedText,
  },

  todayLabel: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  
    calendarModal: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 24,
  },
  });
}

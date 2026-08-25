import { ThemeColors } from "@/constants/theme";
import { Task } from "@/types/tasks";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";

import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import Sortable from "react-native-sortables";

type TaskItemProps = {
  task: Task;
  theme: ThemeColors;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMovePrevious: (task: Task) => void;
  onMoveNext: (task: Task) => void;
  cardWidth: number;
};

export function TaskItem({
  task,
  theme,
  onToggle,
  onEdit,
  onDelete,
  cardWidth
}: TaskItemProps) {
  const styles = createStyles(theme);

  const translateX = useSharedValue(0);

  const SWIPE_THRESHOLD = 72;
  const MAX_SWIPE_DISTANCE = 110;

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .failOffsetY([-12, 12])
    .onUpdate((event) => {
      translateX.value = Math.max(
        -MAX_SWIPE_DISTANCE,
        Math.min(
          MAX_SWIPE_DISTANCE,
          event.translationX
        )
      );
    })
    .onEnd((event) => {
      if (event.translationX >= SWIPE_THRESHOLD) {
        runOnJS(onToggle)(task.id);
      }

      if (event.translationX <= -SWIPE_THRESHOLD) {
        if(task.done){
          runOnJS(onToggle)(task.id);
        } 
        else {
          runOnJS(onDelete)(task);
        }
    }
    })
    .onFinalize(() => {
      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 220,
      });
    });

  const animatedSwipeStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));

    return (
      <View
        style={[
          styles.taskCard,
          { width: cardWidth },
        ]}
      >
        <View style={styles.swipeArea}>
          <View
            style={styles.swipeBackground}
            pointerEvents="none"
          >
            <Text style={styles.completeActionText}>
              Hotovo
            </Text>

            <Text style={styles.deleteActionText}>
              Odstrániť
            </Text>
          </View>

          <GestureDetector gesture={swipeGesture}>
            <Animated.View
              style={[
                styles.swipeContent,
                animatedSwipeStyle,
              ]}
            >
              <Pressable
                style={[
                  styles.checkbox,
                  task.done && styles.checkboxDone,
                ]}
                onPress={() => onToggle(task.id)}
                accessibilityRole="checkbox"
                accessibilityState={{
                  checked: task.done,
                }}
              >
                {task.done && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </Pressable>

              <Pressable
                style={styles.taskContent}
                onPress={() => onEdit(task)}
              >
                <Text
                  style={[
                    styles.taskTitle,
                    task.done && styles.taskTitleDone,
                  ]}
                >
                  {task.title}
                </Text>

                {task.detail ? (
                  <Text style={styles.taskDetail}>
                    {task.detail}
                  </Text>
                ) : null}
              </Pressable>
            </Animated.View>
          </GestureDetector>
        </View>

        <Sortable.Handle style={styles.dragHandle}>
          <View
            style={styles.dragHandleContent}
            accessible
            accessibilityRole="button"
            accessibilityLabel={`Presunúť úlohu ${task.title}`}
          >
            <Text style={styles.dragHandleText}>☰</Text>
          </View>

        </Sortable.Handle>
      </View>
    );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    taskCard: {
      flexDirection: "column",
      alignItems: "stretch",
      backgroundColor: colors.surface,
      borderRadius: 16,
      marginBottom: 12,
      overflow: "hidden",
    },

    checkbox: {
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 8,
      marginRight: 14,
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

    taskContent: {
      flex: 1,
    },

    taskTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
    },

    taskTitleDone: {
      color: colors.placeholder,
      textDecorationLine: "line-through",
    },

    taskDetail: {
      color: colors.mutedText,
      fontSize: 13,
    },
    
    dragHandle: {
      width: "100%",
      height: 28,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    dragHandleText: {
      color: colors.mutedText,
      fontSize: 22,
      fontWeight: "700",
    },

    swipeArea: {
      flex: 1,
      overflow: "hidden",
      width: "100%",
    },

    swipeBackground: {
      ...StyleSheet.absoluteFillObject,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      backgroundColor: colors.secondarySurface,
    },

    swipeContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingLeft: 16,
      paddingRight: 8,
      backgroundColor: colors.surface,
    },

    completeActionText: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: "700",
    },

    deleteActionText: {
      color: colors.danger,
      fontSize: 13,
      fontWeight: "700",
    },

    dragHandleContent: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
  });
}
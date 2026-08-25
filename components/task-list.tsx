import { ThemeColors } from "@/constants/theme";
import { Task } from "@/types/tasks";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Sortable from "react-native-sortables";
import { TaskItem } from "./task-item";

type TaskListProps = {
  tasks: Task[];
  theme: ThemeColors;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onReorder: (tasks: Task[]) => void;
  onMovePrevious: (task: Task) => void;
  onMoveNext: (task: Task) => void;
};

export function TaskList({
  tasks,
  theme,
  onToggle,
  onEdit,
  onDelete,
  onReorder,
  onMovePrevious,
  onMoveNext,
}: TaskListProps) {

  const { width } = useWindowDimensions();
  const taskWidth = width - 48;
  const dragStartX = useSharedValue<number| null>(null);
  const targetDayOffset = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const previousDayZoneStyle = useAnimatedStyle(() => ({
    opacity: isDragging.value
      ? targetDayOffset.value === -1
        ? 1
        : 0.2
      : 0,
    transform: [
      { scale: targetDayOffset.value === -1 ? 1.06 : 1 },
    ],
  }));

  const nextDayZoneStyle = useAnimatedStyle(() => ({
    opacity: isDragging.value
      ? targetDayOffset.value === 1
        ? 1
        : 0.2
      : 0,
    transform: [
      { scale: targetDayOffset.value === 1 ? 1.06 : 1 },
    ],
  }));

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text
            style={[
              styles.emptyTitle,
              { color: theme.text },
            ]}
          >
            Žiadne úlohy
          </Text>

          <Text
            style={[
              styles.emptyText,
              { color: theme.mutedText },
            ]}
          >
            Pre tento deň zatiaľ nemáš žiadne úlohy.
          </Text>
        </View>
      ) : (
        <Sortable.Flex
          customHandle
          flexDirection="column"
          flexWrap="nowrap"
          width={taskWidth}
          strategy="insert"
          dragActivationDelay={0}
          activationAnimationDuration={0}
          dropAnimationDuration={0}
          activeItemScale={1}
          activeItemOpacity={1}
          inactiveItemOpacity={1}
          enableActiveItemSnap={false}
          overDrag="both"
          
          onDragStart={() => {
            "worklet";
            dragStartX.value = null;
            targetDayOffset.value = 0;
            isDragging.value = true;
          }}

          onDragMove={({ touchData }) => {
            "worklet";

            if (dragStartX.value === null) {
              dragStartX.value = touchData.absoluteX;
              return;
            }

            const horizontalDistance =
              touchData.absoluteX - dragStartX.value;

            if (horizontalDistance <= -90) {
              targetDayOffset.value = -1;
              return;
            }

            if (horizontalDistance >= 90) {
              targetDayOffset.value = 1;
              return;
            }

            targetDayOffset.value = 0;
          }}

          onDragEnd={({ fromIndex, order }) => {
            const dayOffset = targetDayOffset.value;
            const draggedTask = tasks[fromIndex];

            dragStartX.value = null;
            targetDayOffset.value = 0;
            isDragging.value = false;

            if (!draggedTask) {
              return;
            }

            if (dayOffset === -1) {
              onMovePrevious(draggedTask);
              return;
            }

            if (dayOffset === 1) {
              onMoveNext(draggedTask);
              return;
            }

            const reorderedTasks = order(tasks);
            onReorder(reorderedTasks);
          }}
        >
          {tasks.map((task) => (
            <TaskItem
              key={task.id.toString()}
              task={task}
              theme={theme}
              cardWidth={taskWidth}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onMovePrevious={onMovePrevious}
              onMoveNext={onMoveNext}
            />
          ))}
        </Sortable.Flex>
      )}
      </ScrollView>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.previousDayZone,
          { backgroundColor: theme.primary },
          previousDayZoneStyle,
        ]}
      >
        <Text style={[styles.dayZoneArrow, { color: theme.onPrimary }]}>←</Text>
        <Text style={[styles.dayZoneText, { color: theme.onPrimary }]}>Predošlý deň</Text>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.nextDayZone,
          { backgroundColor: theme.primary },
          nextDayZoneStyle,
        ]}
      >
        <Text style={[styles.dayZoneArrow, { color: theme.onPrimary }]}>→</Text>
        <Text style={[styles.dayZoneText, { color: theme.onPrimary }]}>Ďalší deň</Text>
      </Animated.View>
    </View>
  );
  }

const styles = StyleSheet.create({
  list: {
    paddingBottom: 24,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },

  container: {
    flex: 1,
    minHeight: 0,
    position: "relative",
  },

  scroll: {
    flex: 1,
  },

  previousDayZone: {
    position: "absolute",
    left: 6,
    top: "35%",
    width: 74,
    minHeight: 112,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    zIndex: 20,
  },

  nextDayZone: {
    position: "absolute",
    right: 6,
    top: "35%",
    width: 74,
    minHeight: 112,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    zIndex: 20,
  },

  dayZoneArrow: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 6,
  },

  dayZoneText: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
});

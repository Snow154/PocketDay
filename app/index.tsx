import { TaskList } from "@/components/task-list";
import { TASKS_STORAGE_KEY } from "@/constants/storage";
import { darkTheme, lightTheme } from "@/constants/theme";
import { createHomeStyles } from "@/styles/homestyle";
import { Task } from "@/types/tasks";
import { calendarDays, dateKeyToDate, formatLongDate, formatTaskDate, toDateKey, TODAY_INDEX, TODAY_KEY, } from "@/utils/date";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, FlatList, Keyboard, Modal, Platform, Pressable, Text, TextInput, useColorScheme, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const tasks: Task[] = [];
type ThemeMode = "light" | "dark";

function formatTaskCount(count: number) {
  if (count === 1) {
    return "1 úloha";
  }

  if (count >= 2 && count <= 4) {
    return `${count} úlohy`;
  }

  return `${count} úloh`;
}

export default function Index() {
  const systemColorScheme = useColorScheme();

  const [themeMode, setThemeMode] =
    useState<ThemeMode>(
      systemColorScheme === "dark"
        ? "dark"
        : "light"
    );

  const isDark = themeMode === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createHomeStyles(theme);

  useEffect(() => {
    setThemeMode(
      systemColorScheme === "dark" ? "dark" : "light" 
    );
  }, [systemColorScheme]);

  const [taskList, setTaskList] = useState(tasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(TODAY_KEY);
  const [newTaskDate, setNewTaskDate] = useState(dateKeyToDate(selectedDate))
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [calendarPickerVisible, setCalendarPickerVisible] = useState(false);
  const [calendarPickerDate, setCalendarPickerDate] = useState(dateKeyToDate(selectedDate));

  const { width } = useWindowDimensions();
  const todayLabel = formatLongDate(new Date());
  const datePageWidth = width - 48;
  const dateListRef =
  useRef<FlatList<Date>>(null);

    useEffect(() => {
      async function loadTasks(){
        try {
          const storedTasks = await AsyncStorage.getItem(
            TASKS_STORAGE_KEY
          );

          if (storedTasks) {
              const parsedTasks: Task[] =
                JSON.parse(storedTasks);

              const migratedTasks = parsedTasks.map(
                (task, index) => ({
                  ...task,
                  order:
                    typeof task.order === "number"
                      ? task.order
                      : index,
                })
              );

              setTaskList(migratedTasks);
            }
        } catch (error) {
          console.error("Not able to load tasks:", error);
        } finally {
          setTasksLoaded(true);
        }
      }

      loadTasks();
    }, []);

    useEffect(() => {
    if (!tasksLoaded) {
      return;
    }

    async function saveTasks() {
      try {
        await AsyncStorage.setItem(
          TASKS_STORAGE_KEY,
          JSON.stringify(taskList)
        );
      } catch (error) {
        console.error("Nepodarilo sa uložiť úlohy:", error);
      }
    }

    saveTasks();
  }, [taskList, tasksLoaded]);

  function toggleTheme() {
    setThemeMode((currentTheme) =>
      currentTheme === "dark"
        ? "light"
        : "dark"
    );
  }

  function toggleTask(id: number) {
  setTaskList((currentTasks) =>
    currentTasks.map((task) =>
      task.id === id
        ? { ...task, done: !task.done }
        : task
      )
    );
  }

  function deleteTask(id: number) {
  setTaskList((currentTasks) =>
    currentTasks.filter((task) => task.id !== id)
  );
  }

  function confirmDeleteTask(task: Task) {
    Alert.alert(
      "Odstrániť úlohu?",
      `Naozaj chceš odstrániť „${task.title}“?`,
      [
        {
          text: "Zrušiť",
          style: "cancel",
        },
        {
          text: "Odstrániť",
          style: "destructive",
          onPress: () => deleteTask(task.id),
        },
      ]
    );
  }

  function openAddTaskModal() {
    setEditingTask(null);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskDate(dateKeyToDate(selectedDate));
    setShowDatePicker(false);
    setModalVisible(true);
  }

  function openEditTaskModal(task: Task) {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.detail);
    setNewTaskDate(
      dateKeyToDate(task.dueDate ?? selectedDate)
    );
    setShowDatePicker(false);
    setModalVisible(true);
  }

  function saveTask() {
    const trimmedTitle = newTaskTitle.trim();
    const trimmedDescription =
      newTaskDescription.trim() || "Bez popisu";

    if (!trimmedTitle) {
      return;
    }

    const dueDate = toDateKey(newTaskDate);

    const tasksForSelectedDate = taskList.filter(
      (task) =>
        (task.dueDate ?? TODAY_KEY) === dueDate
    );

    const nextOrder =
      tasksForSelectedDate.length === 0
        ? 0
        : Math.max(
            ...tasksForSelectedDate.map(
              (task) => task.order
            )
          ) + 1;

    if (editingTask) {
      setTaskList((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                title: trimmedTitle,
                detail: trimmedDescription,
                dueDate,
              }
            : task
        )
      );
    } else {
      const newTask: Task = {
        id: Date.now(),
        title: trimmedTitle,
        detail: trimmedDescription,
        done: false,
        dueDate: toDateKey(newTaskDate),
        order: nextOrder,
      };

      setTaskList((currentTasks) => [
        ...currentTasks,
        newTask,
      ]);
    }

    setEditingTask(null);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setShowDatePicker(false);
    setModalVisible(false);
    Keyboard.dismiss();
  }

  function reorderTasks(reorderedTasks: Task[]) {
    const newOrderById = new Map(
      reorderedTasks.map((task, index) => [
        task.id,
        index,
      ])
    );

    setTaskList((currentTasks) =>
      currentTasks.map((task) => {
        const newOrder = newOrderById.get(task.id);

        if (newOrder === undefined) {
          return task;
        }

        return {
          ...task,
          order: newOrder,
        };
      })
    );
  }

  function moveTaskToDate(
    taskId: number,
    targetDate: string
  ) {
    setTaskList((currentTasks) => {
      const taskToMove = currentTasks.find(
        (task) => task.id === taskId
      );

      if (!taskToMove) {
        return currentTasks;
      }

      const sourceDate =
        taskToMove.dueDate ?? TODAY_KEY;

      if (sourceDate === targetDate) {
        return currentTasks;
      }

      const targetTasks = currentTasks.filter(
        (task) =>
          (task.dueDate ?? TODAY_KEY) === targetDate
      );

      const nextTargetOrder =
        targetTasks.length === 0
          ? 0
          : Math.max(
              ...targetTasks.map((task) => task.order)
            ) + 1;

      const sourceTasksAfterMove = currentTasks
        .filter(
          (task) =>
            task.id !== taskId &&
            (task.dueDate ?? TODAY_KEY) === sourceDate
        )
        .sort(
          (firstTask, secondTask) =>
            firstTask.order - secondTask.order
        );

      const sourceOrderById = new Map(
        sourceTasksAfterMove.map((task, index) => [
          task.id,
          index,
        ])
      );

      return currentTasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            dueDate: targetDate,
            order: nextTargetOrder,
          };
        }

        const newSourceOrder =
          sourceOrderById.get(task.id);

        if (newSourceOrder !== undefined) {
          return {
            ...task,
            order: newSourceOrder,
          };
        }

        return task;
      });
    });
  }

  function moveTaskByDays(
    task: Task,
    numberOfDays: number
  ) {
    const currentDateKey =
      task.dueDate ?? TODAY_KEY;

    const targetDate =
      dateKeyToDate(currentDateKey);

    targetDate.setDate(
      targetDate.getDate() + numberOfDays
    );

    moveTaskToDate(
      task.id,
      toDateKey(targetDate)
    );
  }

  function goToDateIndex(index: number) {
    const safeIndex = Math.max(
      0,
      Math.min(index, calendarDays.length - 1)
    );

    const targetDate = calendarDays[safeIndex];

    if (!targetDate) {
      return;
    }

    dateListRef.current?.scrollToIndex({
      index: safeIndex,
      animated: true,
    });

    setSelectedDate(toDateKey(targetDate));
  }

  const visibleTasks = useMemo(() => {
    return taskList
      .filter((task) => {
        const taskDate =
          task.dueDate ?? TODAY_KEY;

        return taskDate === selectedDate;
      })
      .sort(
        (firstTask, secondTask) =>
          firstTask.order - secondTask.order
      );
  }, [taskList, selectedDate]);
    
  const completedTaskCount = useMemo(() => {
    return visibleTasks.filter(
      (task) => task.done
    ).length;
  }, [visibleTasks]);

  function openCalendarPicker() {
    setCalendarPickerDate(
      dateKeyToDate(selectedDate)
    );

    setCalendarPickerVisible(true);
  }

  function selectCalendarDate(date: Date) {
    const selectedKey = toDateKey(date);

    const selectedIndex = calendarDays.findIndex(
      (calendarDate) =>
        toDateKey(calendarDate) === selectedKey
    );

    if (selectedIndex === -1) {
      return;
    }

    goToDateIndex(selectedIndex);
    setCalendarPickerVisible(false);
  }

    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.date}>{todayLabel}</Text>

            <View style={styles.headerActions}>
              <Pressable
                style={styles.headerIconButton}
                onPress={() => goToDateIndex(TODAY_INDEX)}
                accessibilityRole="button"
                accessibilityLabel="Prejsť na dnešný deň"
                hitSlop={8}
              >
                <Text style={styles.todayIcon}>↺</Text>
              </Pressable>

              <Pressable
                style={styles.headerIconButton}
                onPress={toggleTheme}
                accessibilityRole="switch"
                accessibilityLabel="Prepnúť farebnú tému"
                accessibilityState={{ checked: isDark }}
                hitSlop={8}
              >
                <Text style={styles.themeButtonText}>
                  {isDark ? "☀" : "☾"}
                </Text>
              </Pressable>
            </View>
          </View>
          <Text style={styles.subtitle}>
            Čo dnes potrebuješ dokončiť?
          </Text>
        </View>
        <View style={styles.taskSection}>
    <FlatList
      ref={dateListRef}
      horizontal
      data={calendarDays}
      initialScrollIndex={TODAY_INDEX}
      pagingEnabled
      style={styles.datePager}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(date) => toDateKey(date)}
      getItemLayout={(_, index) => ({
        length: datePageWidth,
        offset: datePageWidth * index,
        index,
      })}
      onMomentumScrollEnd={(event) => {
        const offset = event.nativeEvent.contentOffset.x;
        const index = Math.round(offset / datePageWidth);
        const date = calendarDays[index];

        if (date) {
          setSelectedDate(toDateKey(date));
        }
      }}

      onScrollToIndexFailed={({ index }) => {
        setTimeout(() => {
          dateListRef.current?.scrollToIndex({
            index,
            animated: true,
          });
        }, 100);
      }}
      renderItem={({ item: date }) => {
      const dateKey = toDateKey(date);
      const isToday = dateKey === TODAY_KEY;
      const isPast = dateKey < TODAY_KEY;
      const isFuture = dateKey > TODAY_KEY;

      return (
        <Pressable
          style={[
            styles.datePage,
            { width: datePageWidth },
            isToday && styles.datePageToday,
            isPast && styles.datePagePast,
            isFuture && styles.datePageFuture,
          ]}
          onPress={openCalendarPicker}
          accessibilityRole="button"
          accessibilityLabel="Otvoriť kalendár"
        >
          {isToday && (
            <Text style={styles.todayLabel}>
              DNES
            </Text>
          )}

          <Text
            style={[
              styles.dateWeekday,
              !isToday && styles.dateTextDimmed,
            ]}
          >
            {new Intl.DateTimeFormat("sk-SK", {
              weekday: "long",
            }).format(date)}
          </Text>

          <Text
            style={[
              styles.dateFull,
              !isToday && styles.dateTextDimmed,
            ]}
          >
            {new Intl.DateTimeFormat("sk-SK", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(date)}
          </Text>
        </Pressable>
      );
    }}
    />

    <View style={styles.taskStats}>
      <Text style={styles.taskCount}>
        {formatTaskCount(visibleTasks.length)}
      </Text>

      {visibleTasks.length > 0 && (
        <Text style={styles.completedCount}>
          Dokončené: {completedTaskCount}/{visibleTasks.length}
        </Text>
      )}
    </View>

          <Pressable
            style={styles.openModalButton}
            onPress={openAddTaskModal}
          >
            <Text style={styles.openModalButtonText}>+ Pridať úlohu</Text>
          </Pressable>

          <TaskList
            tasks={visibleTasks}
            theme={theme}
            onToggle={toggleTask}
            onEdit={openEditTaskModal}
            onDelete={confirmDeleteTask}
            onReorder={reorderTasks}
            onMovePrevious={(task) =>
              moveTaskByDays(task, -1)
            }
            onMoveNext={(task) =>
              moveTaskByDays(task, 1)
            }
          />
        </View>

        {/* Kalendár pre Android */}
        {calendarPickerVisible &&
          Platform.OS === "android" && (
            <DateTimePicker
              value={calendarPickerDate}
              mode="date"
              display="calendar"
              minimumDate={calendarDays[0]}
              maximumDate={
                calendarDays[calendarDays.length - 1]
              }
              onChange={(event, selectedCalendarDate) => {
                setCalendarPickerVisible(false);

                if (
                  event.type === "set" &&
                  selectedCalendarDate
                ) {
                  selectCalendarDate(
                    selectedCalendarDate
                  );
                }
              }}
            />
          )}

        {/* Kalendár pre iOS */}
        <Modal
          visible={
            calendarPickerVisible &&
            Platform.OS === "ios"
          }
          transparent
          animationType="fade"
          onRequestClose={() => {
            setCalendarPickerVisible(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.calendarModal}>
              <Text style={styles.modalTitle}>
                Vyber deň
              </Text>

              <DateTimePicker
                value={calendarPickerDate}
                mode="date"
                display="inline"
                minimumDate={calendarDays[0]}
                maximumDate={
                  calendarDays[calendarDays.length - 1]
                }
                onChange={(_, selectedCalendarDate) => {
                  if (selectedCalendarDate) {
                    setCalendarPickerDate(
                      selectedCalendarDate
                    );
                  }
                }}
              />

              <View style={styles.modalActions}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => {
                    setCalendarPickerVisible(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>
                    Zrušiť
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.confirmButton}
                  onPress={() => {
                    selectCalendarDate(
                      calendarPickerDate
                    );
                  }}
                >
                  <Text style={styles.confirmButtonText}>
                    Vybrať
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setEditingTask(null);
            setModalVisible(false);
            setShowDatePicker(false);
            Keyboard.dismiss();
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingTask ? "Upraviť úlohu" : "Nová úloha"}
              </Text>

              <Text style={styles.inputLabel}>Názov</Text>

              <TextInput
                style={styles.modalInput}
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                placeholder="Napríklad: Nakúpiť potraviny"
                placeholderTextColor={theme.placeholder}
                autoFocus
              />

              <Text style={styles.inputLabel}>Popis</Text>

              <TextInput
                style={[styles.modalInput, styles.descriptionInput]}
                value={newTaskDescription}
                onChangeText={setNewTaskDescription}
                placeholder="Pridaj podrobnosti..."
                placeholderTextColor={theme.placeholder}
                multiline
                textAlignVertical="top"
              />

              <Text style={styles.inputLabel}>Dátum</Text>

              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateInputText}>
                  {formatTaskDate(newTaskDate)}
                </Text>
              </Pressable>

              {showDatePicker && (
                <>
                  <DateTimePicker
                    value={newTaskDate}
                    mode="date"
                    minimumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      if (Platform.OS === "android") {
                        setShowDatePicker(false);
                      }

                      if (
                        event.type === "set" &&
                        selectedDate
                      ) {
                        setNewTaskDate(selectedDate);
                      }
                    }}
                  />

                  {Platform.OS === "ios" && (
                    <Pressable
                      style={styles.datePickerDoneButton}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={styles.datePickerDoneText}>
                        Hotovo
                      </Text>
                    </Pressable>
                  )}
                </>
              )}

              <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => {
                  setEditingTask(null);
                  setModalVisible(false);
                  setShowDatePicker(false);
                  Keyboard.dismiss();
                }}
              >
                <Text style={styles.cancelButtonText}>
                  Zrušiť
                </Text>
              </Pressable>

              <Pressable
                style={styles.confirmButton}
                onPress={saveTask}
              >
                <Text style={styles.confirmButtonText}>
                  {editingTask ? "Uložiť" : "Pridať"}
                </Text>
              </Pressable>
            </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
;

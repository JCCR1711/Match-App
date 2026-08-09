import CustomText from "@/src/components/ui/CustomText";
import CustomTextTitle from "@/src/components/ui/CustomTextTitle";
import TextSubTitle from "@/src/components/ui/TextSubTitle";
import CustomIcon from "@/src/components/ui/CustomIcon";
import { theme } from "@/src/theme";
import { FieldPlay } from "@/src/types/FieldPlay";
import { Alert02Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit/v2";
import { SafeAreaView } from "react-native-safe-area-context";
import ScheduleCard from "../components/ScheduleCard";
import SummaryCard from "../components/SummaryCard";

const PerformanceFieldView = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [field] = useState<FieldPlay | null>(null);

  const data = [
    { month: "Jan", revenue: 52 },
    { month: "Feb", revenue: 86 },
    { month: "Mar", revenue: 58 },
    { month: "Apr", revenue: 134 },
  ];

  const volver = () => {
    router.back();
  };

  useEffect(() => {
    // La información del campo se conectará posteriormente
    // con la fuente de datos correspondiente.
    console.log("Campo solicitado:", id);
  }, [id]);

  if (!field) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Pressable onPress={volver} style={styles.backButton}>
            <CustomIcon icon={ArrowLeft01Icon} color="#ffffff" size={28} />
            <Text style={styles.backText}>Volver</Text>
          </Pressable>

          <CustomTextTitle text="Rendimiento" style={styles.emptyTitle} />

          <CustomText
            text="No hay información disponible para esta cancha."
            style={styles.emptyText}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={volver} style={styles.backButton}>
          <CustomIcon icon={ArrowLeft01Icon} color="#ffffff" size={28} />

          <CustomTextTitle text="Rendimiento" style={styles.title} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <TextSubTitle text={field.name} style={styles.fieldName} />

            <TextSubTitle text="Activa" style={styles.active} />
          </View>

          <CustomText text={field.direction} />
        </View>

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <TextSubTitle text="Ingresos por día" />

            <Pressable style={styles.row}>
              <CustomText text="Semanal" />
            </Pressable>
          </View>

          <View
            onLayout={(event) => {
              setWidth(event.nativeEvent.layout.width);
              setHeight(event.nativeEvent.layout.height);
            }}
            style={styles.chartContainer}
          >
            {width > 0 && height > 0 && (
              <LineChart
                data={data}
                xKey="month"
                yKey="revenue"
                width={width}
                height={height}
                theme={theme.createLineChartTheme(theme.colors.electricBlue)}
                curve="monotone"
                showDots={false}
                showHorizontalGridLines={false}
                showVerticalGridLines={false}
                yAxisLabelWidth={0}
                formatYLabel={() => ""}
              />
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <TextSubTitle text="Horas Pico" />

            <CustomIcon icon={Alert02Icon} color="#e0e0e0" size={20} />
          </View>

          <View style={styles.chartContainer}>
            {width > 0 && height > 0 && (
              <LineChart
                data={data}
                xKey="month"
                yKey="revenue"
                width={width}
                height={height}
                theme={theme.createLineChartTheme(theme.colors.luminousLavender)}
                curve="monotone"
                showDots={false}
                showHorizontalGridLines={false}
                showVerticalGridLines={false}
                yAxisLabelWidth={0}
                formatYLabel={() => ""}
              />
            )}
          </View>
        </View>

        <View style={styles.section}>
          <TextSubTitle text="Horarios con mayor rendimiento" />

          {field.bestSchedules.map((schedule, index) => (
            <ScheduleCard
              key={`${schedule}-${index}`}
              indice={index + 1}
              schedule={schedule}
            />
          ))}
        </View>

        <View style={styles.section}>
          <TextSubTitle text="Resumen" />

          <SummaryCard
            Ingresos={field.summary.Ingresos}
            IngresosPorcentaje={field.summary.IngresosPorcentaje}
            Ocupacion={field.summary.Ocupacion}
            OcupacionPorcentaje={field.summary.OcupacionPorcentaje}
            Reservas={field.summary.Reservas}
            ReservasPorcentaje={field.summary.ReservasPorcentaje}
          />
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <CustomTextTitle
              text={`S/${field.summary.IngresosTotales}`}
              style={styles.summaryValue}
            />
          </View>

          <View style={styles.summaryItem}>
            <CustomTextTitle
              text={`${field.summary.HorasTotales} h`}
              style={styles.summaryValue}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PerformanceFieldView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  content: {
    padding: 20,
    gap: 20,
  },

  section: {
    gap: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  backText: {
    color: "#ffffff",
    fontSize: 16,
  },

  title: {
    color: "#ffffff",
    fontSize: 30,
  },

  fieldName: {
    color: "#ffffff",
    fontSize: 25,
  },

  active: {
    color: "#73FE65",
  },

  chartContainer: {
    minHeight: 300,
    width: "100%",
  },

  summaryRow: {
    flexDirection: "row",
    gap: 10,
  },

  summaryItem: {
    flex: 1,
    borderRightWidth: 2,
    borderColor: "#ffffff",
  },

  summaryValue: {
    color: "#ffffff",
  },

  emptyContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },

  emptyTitle: {
    color: "#ffffff",
    fontSize: 30,
  },

  emptyText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
  },
});

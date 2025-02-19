"use client";

import { ResponsiveRadar } from "@nivo/radar";
import assessmentData from "../data/AssessmentReportFaker.json";

interface Skill {
  name: string;
  score: number;
  maxScore: number;
  description?: string;
}

interface RadarChartProps {
  data?: Skill[];
}

const RadarChart = ({ data = assessmentData.assessmentReport.skills }: RadarChartProps) => {
  const chartData = data.map((skill) => ({
    skill: skill.name,
    score: skill.score,
    description: skill.description,
  }));

  return (
    <ResponsiveRadar
      data={chartData}
      keys={["score"]}
      indexBy="skill"
      maxValue={100}
      margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
      curve="linearClosed"
      borderWidth={2}
      borderColor={{ theme: "background" }}
      gridLabelOffset={16}
      dotSize={8}
      dotColor={{ theme: "background" }}
      dotBorderWidth={2}
      colors={{ scheme: "nivo" }}
      fillOpacity={0.25}
      blendMode="multiply"
      motionConfig="wobbly"
      valueFormat={value => `${value}%`}
    />
  );
};

export default RadarChart; 
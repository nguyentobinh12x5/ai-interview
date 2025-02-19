"use client";

import { ArrowLeft, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";
import Link from "next/link";
import assessmentData from "./data/AssessmentReportFaker.json";

// Dynamically import the radar chart to avoid SSR issues
const RadarChart = dynamic(() => import("./components/RadarChart"), { ssr: false });

const skills = [
  { name: "Learning and Enthusiasm", score: 0, maxScore: 20 },
  { name: "Personal Style", score: 53, maxScore: 20 },
  { name: "Special Skills", score: 0, maxScore: 20 },
  { name: "Problem-solving Skills", score: 0, maxScore: 20 },
  { name: "Professionalism", score: 60, maxScore: 20 },
];

const AssessmentReport = () => {
  const { assessmentReport } = assessmentData;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 lg:p-6 xl:p-8">
      {/* Header with enhanced styling */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Link href="/mock-interview">
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-gray-50 hover:text-indigo-600 transition-all duration-200"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                Interview Performance Analysis
              </h1>
              <p className="text-sm text-gray-500">Detailed insights into your interview performance</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
            <Clock className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-medium">{new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="recap" className="mb-8">
          <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            <TabsTrigger 
              value="recap" 
              className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg transition-all duration-200"
            >
              Recap
            </TabsTrigger>
            <TabsTrigger 
              value="detail"
              className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg transition-all duration-200"
            >
              Detail
            </TabsTrigger>
            <TabsTrigger 
              value="coach"
              className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 rounded-lg transition-all duration-200"
            >
              Coach
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recap">
            <div className="space-y-6">
              {/* Overview Card with enhanced design */}
              <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    Overview
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100/50">
                      <p className="text-sm font-medium text-gray-600 mb-2">Overall Readiness Score</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-indigo-600 animate-in fade-in duration-700">
                          {assessmentReport.overallScore}
                        </span>
                        <span className="text-gray-500 text-lg">/100</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100/50">
                      <p className="text-sm font-medium text-gray-600 mb-2">Your Readiness Level</p>
                      <div className="text-5xl font-bold text-indigo-600 animate-in fade-in duration-700">
                        {assessmentReport.readinessLevel.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Feedback Section */}
              <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm overflow-hidden">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    Key Feedback
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  </h2>
                  <div className="space-y-4">
                    {assessmentReport.feedback.map((feedback, index) => (
                      <div 
                        key={index}
                        className="group p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-indigo-100 transition-all duration-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500 group-hover:bg-indigo-600 transition-colors" />
                          <p className="text-gray-600 group-hover:text-gray-700 transition-colors">{feedback}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Interview Summary */}
              <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    Interview Summary
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  </h2>
                  <div className="space-y-4 bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                    {assessmentReport.interviewSummary.map((sentence, index) => (
                      <p 
                        key={index} 
                        className="text-gray-600 leading-relaxed animate-in fade-in slide-in-from-bottom-2"
                      >
                        {sentence}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Suggestions for Improvement */}
              <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    Improvement Areas
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {assessmentReport.suggestions?.map((suggestion, index) => (
                      <div 
                        key={index}
                        className="group p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100/50 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                            <span className="text-indigo-600 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                            {suggestion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Section with enhanced visualization */}
              <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    Skill Analysis
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-[300px] bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-100">
                      <RadarChart data={assessmentReport.skills} />
                    </div>
                    <div className="space-y-6">
                      {assessmentReport.skills.map((skill) => (
                        <div key={skill.name} className="group">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
                              {skill.name}
                            </span>
                            <span className="text-sm text-gray-500">{skill.score}</span>
                          </div>
                          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500 ease-out group-hover:from-indigo-600 group-hover:to-indigo-700"
                              style={{ width: `${(skill.score / skill.maxScore) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1.5 group-hover:text-indigo-500 transition-colors duration-200">
                            {skill.maxScore}% of total score
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AssessmentReport; 
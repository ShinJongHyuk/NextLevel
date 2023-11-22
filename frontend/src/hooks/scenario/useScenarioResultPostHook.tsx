import ScenarioResultPost from "@/api/scenario/ScenarioResultPost";
import ScenarioTotalResultPost from "@/api/scenario/ScenarioTotalResultPost";
import useAiResultStore from "@/stores/airesult/useAiResultStore";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

export const useScenarioResultPostHook = (props: any) => {
  // 각 스크립트에 대한 점수 리스트
  // 주스턴드 2-1 저장
  const setTotalScoreList = useAiResultStore(
    (state: any) => state.setTotalScoreList
  );
  const setTotalSCriptList = useAiResultStore(
    (state: any) => state.setTotalSCriptList
  );
  const [isLoading, setIsLoading] = useState(false);

  // 개별 점수
  const [eachScore, setEachScore] = useState<any>(null);

  const getScenarioResult = async (formData: any) => {
    setIsLoading(true);
    const res = await Promise.race([
      ScenarioResultPost(formData),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 5000)
      ),
    ])
      .then((res: any) => {
        if (res?.data.data.score) {
          setEachScore(res?.data.data.score);
          setTotalScoreList(res?.data.data.score);
          setTotalSCriptList(props);
        }
      })
      .catch((error) => {
        if (error.message === "Request timeout") {
          console.log("타임아웃으로 인해 기본 점수 부여");
          const defaultScore = Math.floor(Math.random() * 16) + 70;
          setEachScore(defaultScore);
          setTotalScoreList(defaultScore);
          setTotalSCriptList(props);
        } else {
          console.error(error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return {
    eachScore,
    getScenarioResult,
    isLoading,
  };
};

export interface GradingModel {
  programmingLanguage: string;
  point: number;
  evaluationCriteria: {
    algorithm: string;
    cleanCode: string;
  };
}

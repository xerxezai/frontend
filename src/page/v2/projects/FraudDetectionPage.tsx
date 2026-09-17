// FraudDetectionPage.tsx
// Purpose: /project/fraud-detection-mlops — case study data for the
//          Real-Time Fraud Detection System project, rendered through
//          <ProjectCaseStudyTemplate>.
// Used in: src/App.tsx (route: /project/fraud-detection-mlops)
// Data source: original XERXEZ copy per the client's project brief. No
//              invented statistics — every number below is one the client
//              supplied for this case study.

import { Gauge, Waypoints, BrainCircuit, RefreshCw, Network, BrainCog, Cpu, Cloud } from "lucide-react";
import ProjectCaseStudyTemplate, { type CaseStudyData } from "./ProjectCaseStudyTemplate";

const data: CaseStudyData = {
  seoTitle: "Real-Time Fraud Detection System | Case Study | XERXEZ",
  seoDesc: "How XERXEZ built a real-time ML fraud detection system for a financial institution — 10M+ daily detections, sub-100ms latency, 99.2% accuracy, $6.2M fraud prevented annually.",
  canonical: "/project/fraud-detection-mlops",

  category: "MLOps",
  industry: "Financial Services",
  duration: "14 weeks",
  team: "6 engineers",
  keyMetricValue: "10M+",
  keyMetricLabel: "Daily detections",
  title: "Real-Time Fraud Detection System",
  techStack: [
    { icon: Network, name: "Kafka" },
    { icon: BrainCog, name: "PyTorch" },
    { icon: Cpu, name: "Flink" },
    { icon: Cloud, name: "GCP" },
  ],

  challenge: "A financial institution processing 10M+ daily transactions was running a legacy rule-based fraud system with a 23% false positive rate — blocking large numbers of legitimate customers while still missing fraud patterns that cost the business $8M annually. The rules-based approach simply couldn't keep pace with how fraud actually evolved.",

  solutionPoints: [
    { icon: Gauge, title: "Real-Time ML Fraud Detection", desc: "Detection running at sub-100ms latency, fast enough to act in the moment." },
    { icon: Waypoints, title: "Kafka Streaming Pipeline", desc: "Handling 10M+ daily transactions as a continuous stream." },
    { icon: BrainCircuit, title: "PyTorch Deep Learning Model", desc: "A model achieving 99.2% accuracy on real transaction data." },
    { icon: RefreshCw, title: "Automated Retraining Pipeline", desc: "Triggered automatically by fraud pattern drift." },
  ],

  results: [
    { value: "10M+", label: "Daily Detections" },
    { value: "<100ms", label: "Latency" },
    { value: "99.2%", label: "Accuracy" },
    { value: "23%→2.1%", label: "False Positive Rate" },
    { value: "$6.2M", label: "Fraud Prevented Annually" },
  ],

  steps: [
    { title: "Data Pipeline", desc: "Built a Kafka streaming pipeline ingesting 10M+ daily transactions with sub-10ms latency." },
    { title: "Model Development", desc: "Trained a PyTorch deep learning model on 3 years of transaction history, achieving 99.2% accuracy." },
    { title: "Real-Time Serving", desc: "Deployed with Flink for sub-100ms inference with automatic scaling." },
    { title: "MLOps & Monitoring", desc: "Automated retraining pipeline with drift detection, A/B testing and performance dashboards." },
  ],

  sidebar: [
    { label: "Category", value: "MLOps" },
    { label: "Industry", value: "Financial Services" },
    { label: "Duration", value: "14 weeks" },
    { label: "Team Size", value: "6 engineers" },
  ],

  prev: { title: "Kubernetes Security Hardening", href: "/project/kubernetes-security" },
};

const FraudDetectionPage = () => <ProjectCaseStudyTemplate data={data} />;

export default FraudDetectionPage;

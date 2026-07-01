import React, { useRef, useCallback, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import type { ProjectDataType } from "../../types";
import { projectsData } from "../../data";
import Image from "../utils/Image";

// ── Brand tokens (exact match to site) ───────────────────────────────────
const GOLD = "#C9883A";
const C    = "#cc785c";
const GRAD = "linear-gradient(135deg,#cc785c 0%,#C9883A 100%)";
const DARK = "#1a1208";
const DARKER = "#0f0a05";
const CREAM = "#F8F7F4";
const OFF   = "#F2EFE9";

// ── Motion safety ─────────────────────────────────────────────────────────
const prefersReduced =
  typeof window !== "undefined" &&
  (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
   window.matchMedia("(hover: none)").matches);

// ── Count-up hook (same pattern used site-wide) ───────────────────────────
function useCountUp(target: number, duration = 1600, trigger = false) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    if (!trigger || target <= 0) { setVal(target); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(ease * target));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, trigger]);
  return val;
}

// ── Project rich metadata ─────────────────────────────────────────────────
interface DetailMeta {
  desc: string;
  tags: string[];
  stat: string;
  statLabel: string;
  statRaw: number;
  statPrefix: string;
  statSuffix: string;
  industry: string;
  duration: string;
  teamSize: string;
  challenge: string;
  solution: string;
  results: { metric: string; label: string; raw: number; prefix?: string; suffix?: string }[];
  process: { step: string; title: string; desc: string }[];
}

const META: Record<string, DetailMeta> = {
  "ai-erp-platform": {
    desc: "End-to-end AI-native ERP deployment replacing a 15-year legacy system across finance, HR, supply chain, and operations — delivering measurable ROI from week one of go-live.",
    tags: ["Python", "TensorFlow", "SAP", "Azure", "Kubernetes", "PostgreSQL", "React"],
    stat: "$2M", statLabel: "First-year savings", statPrefix: "$", statRaw: 2, statSuffix: "M",
    industry: "Manufacturing", duration: "14 weeks", teamSize: "12 engineers",
    challenge: "A 2,400-person manufacturer ran a 15-year-old ERP requiring 3 FTEs to reconcile inventory and 72 hours to close the month. Every planning cycle relied on spreadsheets exported from a system that cost more to maintain than replace.",
    solution: "XERXEZ deployed an AI-native ERP with ML demand forecasting, automated procurement triggers, and a real-time BI layer — running a parallel migration over 14 weeks to eliminate cutover risk across 6 phased module rollouts.",
    results: [
      { metric: "$2M", label: "First-year operational savings", raw: 2, prefix: "$", suffix: "M" },
      { metric: "4h", label: "Month-end close (was 72h)", raw: 4, suffix: "h" },
      { metric: "38%", label: "Inventory carrying costs cut", raw: 38, suffix: "%" },
    ],
    process: [
      { step: "01", title: "Discovery & Audit", desc: "Mapped 140 legacy workflows and identified 38 automation candidates across all business units." },
      { step: "02", title: "Data Migration", desc: "Cleansed 8 years of transactional data, resolved 14,000 duplicate SKUs, and built the AI training foundation." },
      { step: "03", title: "Parallel Deployment", desc: "Ran AI ERP alongside legacy for 6 weeks with real-time reconciliation — 2-hour final cutover window." },
      { step: "04", title: "AI Training & Go-Live", desc: "Trained demand forecasting models on 3 years of history, validated against actuals, then handed over to client's team." },
    ],
  },
  "mlops-pipeline": {
    desc: "Scalable MLOps automation platform that cut model deployment cycles from 3 weeks to under 4 hours — enabling the data science team to ship production models weekly instead of quarterly.",
    tags: ["Kubernetes", "MLflow", "Python", "AWS", "Airflow", "Docker", "FastAPI"],
    stat: "95%", statLabel: "Faster deployments", statPrefix: "", statRaw: 95, statSuffix: "%",
    industry: "Financial Services", duration: "10 weeks", teamSize: "8 engineers",
    challenge: "A fintech's data science team had 40+ models across various development stages but no standardised production path. Deployment was a manual 3-week process per model, creating a backlog that made the entire ML programme commercially invisible.",
    solution: "XERXEZ built a fully automated MLOps pipeline with standardised model packaging, automated testing gates, canary deployment, and real-time monitoring — making model deployment a single-click operation with full audit trails.",
    results: [
      { metric: "95%", label: "Faster model deployments", raw: 95, suffix: "%" },
      { metric: "40+", label: "Models in production", raw: 40, suffix: "+" },
      { metric: "99.9%", label: "Pipeline availability", raw: 99, suffix: "%" },
    ],
    process: [
      { step: "01", title: "Pipeline Audit", desc: "Assessed 40+ models, deployment bottlenecks, and infrastructure gaps across the data science org." },
      { step: "02", title: "Standardisation", desc: "Defined model packaging standards, testing requirements, and feature store architecture." },
      { step: "03", title: "CI/CD Build", desc: "Built automated testing, canary deployment, and monitoring infrastructure on AWS EKS." },
      { step: "04", title: "Team Enablement", desc: "Trained 22 data scientists on the new workflow with full internal documentation." },
    ],
  },
  "cloud-infrastructure": {
    desc: "Zero-trust cloud architecture achieving 99.9% uptime with continuous compliance monitoring across AWS, Azure, and GCP — earning SOC 2 Type II within 12 weeks.",
    tags: ["Terraform", "AWS", "Kubernetes", "Vault", "Falco", "OPA", "Prometheus"],
    stat: "99.9%", statLabel: "Uptime achieved", statPrefix: "", statRaw: 99, statSuffix: "%",
    industry: "Technology", duration: "12 weeks", teamSize: "10 engineers",
    challenge: "A high-growth SaaS ran on single-cloud infrastructure with no DR plan, manual security patching, and a compliance posture blocking their Series B. Uptime over the prior year was 97.1% — costing $1.4M in SLA credits.",
    solution: "XERXEZ re-architected the full infrastructure as code, implemented zero-trust networking, automated compliance scanning, and built a multi-region active-active deployment that eliminated every single point of failure.",
    results: [
      { metric: "99.9%", label: "Uptime SLA delivered", raw: 99, suffix: "%" },
      { metric: "100%", label: "Infrastructure as code", raw: 100, suffix: "%" },
      { metric: "$1.4M", label: "SLA credits recovered", raw: 1, prefix: "$", suffix: "M" },
    ],
    process: [
      { step: "01", title: "Infrastructure Audit", desc: "Full threat modelling, uptime analysis, and compliance gap assessment across 3 cloud providers." },
      { step: "02", title: "IaC Refactor", desc: "Converted 100% of infrastructure to Terraform, enabling reproducible auditable deployments." },
      { step: "03", title: "Zero-Trust Network", desc: "Deployed service mesh, mTLS, and policy-as-code across all inter-service communication." },
      { step: "04", title: "Compliance & Certification", desc: "Automated SOC 2 evidence collection and guided the client through Type II audit in 12 weeks." },
    ],
  },
  "enterprise-saas": {
    desc: "Multi-tenant SaaS platform serving 500+ enterprise clients at 99.95% availability — built from a monolith migration to microservices with zero customer-visible downtime during cutover.",
    tags: ["React", "Node.js", "PostgreSQL", "GCP", "GraphQL", "Redis", "Stripe"],
    stat: "500+", statLabel: "Enterprise clients", statPrefix: "", statRaw: 500, statSuffix: "+",
    industry: "SaaS", duration: "20 weeks", teamSize: "15 engineers",
    challenge: "A B2B platform ran a 6-year-old monolith: 4-hour deploys, no independent component scaling, and 200ms average API response times causing churn among enterprise accounts with strict SLA requirements.",
    solution: "XERXEZ designed and delivered a complete microservices decomposition — extracting 14 services from the monolith, building an API gateway, and implementing multi-tenant data isolation — all behind feature flags enabling zero-downtime migration.",
    results: [
      { metric: "500+", label: "Enterprise clients served", raw: 500, suffix: "+" },
      { metric: "99.95%", label: "Availability SLA", raw: 99, suffix: "%" },
      { metric: "12ms", label: "Avg API response (was 200ms)", raw: 12, suffix: "ms" },
    ],
    process: [
      { step: "01", title: "Monolith Mapping", desc: "Identified 14 bounded contexts and decomposition boundaries with the client's engineering leads." },
      { step: "02", title: "Data Layer Design", desc: "Designed multi-tenant data isolation, per-service databases, and event sourcing for consistency." },
      { step: "03", title: "Strangler Migration", desc: "Used strangler fig pattern — each service extracted behind a feature flag with dual-write validation." },
      { step: "04", title: "Cutover & Optimisation", desc: "45-minute maintenance window for final cutover; API response times dropped 94% within 48 hours." },
    ],
  },
  "ai-training-program": {
    desc: "Corporate AI upskilling programme that trained 1,200+ professionals across 8 enterprise clients — covering ML fundamentals, LLM engineering, and production AI deployment in 8-week project-based cohorts.",
    tags: ["Python", "Jupyter", "LangChain", "OpenAI", "PyTorch", "Hugging Face"],
    stat: "1,200+", statLabel: "Engineers trained", statPrefix: "", statRaw: 1200, statSuffix: "+",
    industry: "Enterprise Training", duration: "6 months", teamSize: "6 instructors",
    challenge: "Eight enterprise clients faced a critical shortage of AI/ML talent — engineers who could move from understanding concepts to building and shipping production ML systems. Off-the-shelf courses were too theoretical and missed production deployment entirely.",
    solution: "XERXEZ built a project-based curriculum where each cohort shipped a real production-ready AI feature against their employer's actual systems — bridging theory to production with live deployment in week 8.",
    results: [
      { metric: "1,200+", label: "Engineers certified", raw: 1200, suffix: "+" },
      { metric: "94%", label: "Cohort completion rate", raw: 94, suffix: "%" },
      { metric: "8", label: "Enterprise clients served", raw: 8, suffix: "" },
    ],
    process: [
      { step: "01", title: "Skills Assessment", desc: "Benchmarked current AI literacy across all cohorts and tailored curriculum to fill specific gaps per org." },
      { step: "02", title: "Curriculum Design", desc: "Built 8-week modular curriculum: ML theory, Python pipelines, LLM engineering, production deployment." },
      { step: "03", title: "Live Cohorts", desc: "Delivered 24 cohorts across 3 time zones with real enterprise use cases as the project substrate." },
      { step: "04", title: "Certification & Handover", desc: "Graduates certified via live code review; internal champions trained to run future cohorts independently." },
    ],
  },
  "digital-transformation": {
    desc: "Digital transformation roadmap and execution reducing operational costs by 38% across a 10,000-person organisation — spanning 14 countries, 6 business units, and a 3-year technology refresh.",
    tags: ["Agile", "TOGAF", "AWS", "Power BI", "ServiceNow", "Salesforce"],
    stat: "38%", statLabel: "Cost reduction", statPrefix: "", statRaw: 38, statSuffix: "%",
    industry: "Professional Services", duration: "18 months", teamSize: "20 consultants",
    challenge: "A global professional services firm ran 140+ disconnected legacy systems across 14 countries, spending $28M annually on IT that produced no competitive differentiation. Leadership needed a prioritised roadmap with quantified ROI before committing board capital.",
    solution: "XERXEZ conducted an enterprise architecture review, built a capability heat map, and delivered a 3-year phased transformation roadmap — then executed the first phase including cloud migration, process automation, and a unified data platform.",
    results: [
      { metric: "38%", label: "Operational cost reduction", raw: 38, suffix: "%" },
      { metric: "140+", label: "Legacy systems consolidated", raw: 140, suffix: "+" },
      { metric: "$10M", label: "Annual IT savings", raw: 10, prefix: "$", suffix: "M" },
    ],
    process: [
      { step: "01", title: "Current State Analysis", desc: "Mapped 140 systems, 28 processes, and 6 business units to identify duplication and automation targets." },
      { step: "02", title: "Roadmap Design", desc: "Prioritised 3-year transformation roadmap by ROI, risk, and strategic alignment — with board-ready business case." },
      { step: "03", title: "Phase 1 Execution", desc: "Cloud migration of 40 systems, RPA for 14 processes, and unified data platform rollout." },
      { step: "04", title: "Change Management", desc: "Trained 800+ staff, embedded transformation leads in each business unit, and established a Digital PMO." },
    ],
  },
  "supply-chain-ai": {
    desc: "AI-driven supply chain optimisation reducing inventory carrying costs by 28% and improving order fulfilment speed by 41% — deployed across 8 distribution centres in 12 weeks.",
    tags: ["PySpark", "Snowflake", "Python", "Azure", "Databricks", "Power BI"],
    stat: "28%", statLabel: "Inventory savings", statPrefix: "", statRaw: 28, statSuffix: "%",
    industry: "Retail & Logistics", duration: "12 weeks", teamSize: "9 engineers",
    challenge: "A multi-national retailer held 45% more inventory than demand models predicted, with $18M tied up in slow-moving stock. Their 3-year-old forecasting model ignored external signals — weather, promotions, and competitor activity — producing systematic over-ordering.",
    solution: "XERXEZ built a real-time demand sensing platform ingesting 22 external signals into ML models, producing daily per-SKU reorder recommendations per location — cutting overstock while eliminating stockouts on key lines.",
    results: [
      { metric: "28%", label: "Inventory cost reduction", raw: 28, suffix: "%" },
      { metric: "41%", label: "Faster fulfilment", raw: 41, suffix: "%" },
      { metric: "$18M", label: "Working capital freed", raw: 18, prefix: "$", suffix: "M" },
    ],
    process: [
      { step: "01", title: "Data Audit", desc: "Mapped 3 years of inventory transactions across 8 DCs and 140,000 SKUs to identify forecasting failure modes." },
      { step: "02", title: "Signal Engineering", desc: "Identified and integrated 22 external demand signals: weather, events, promotions, competitor data." },
      { step: "03", title: "Model Build", desc: "Trained per-SKU ML models in Databricks, validated against holdout periods, automated daily inference." },
      { step: "04", title: "Integration & Scale", desc: "Integrated recommendations into the existing ERP and rolled out to all 8 distribution centres in 4 weeks." },
    ],
  },
  "kubernetes-security": {
    desc: "Full Kubernetes security hardening across 3 cloud providers achieving SOC 2 Type II certification — covering 60+ clusters, 400+ microservices, and continuous automated compliance.",
    tags: ["Kubernetes", "Falco", "OPA", "AWS", "GCP", "Azure", "Trivy", "Vault"],
    stat: "SOC 2", statLabel: "Type II certified", statPrefix: "", statRaw: 0, statSuffix: "",
    industry: "FinTech", duration: "16 weeks", teamSize: "7 engineers",
    challenge: "A high-growth FinTech ran 60+ Kubernetes clusters across AWS, GCP, and Azure with no unified security posture, no runtime threat detection, and was 18 months from an SOC 2 audit needed to close enterprise deals.",
    solution: "XERXEZ implemented a zero-trust Kubernetes security framework with Falco for runtime detection, OPA for policy enforcement, automated secret rotation via Vault, and a continuous compliance evidence pipeline.",
    results: [
      { metric: "60+", label: "Clusters hardened", raw: 60, suffix: "+" },
      { metric: "100%", label: "Policy compliance rate", raw: 100, suffix: "%" },
      { metric: "0", label: "Critical CVEs at go-live", raw: 0, suffix: "" },
    ],
    process: [
      { step: "01", title: "Security Posture Audit", desc: "Full assessment of 60+ clusters — CVE scanning, RBAC audit, network policy review, secrets exposure mapping." },
      { step: "02", title: "Policy Framework", desc: "Built OPA Gatekeeper policies enforcing image signing, resource limits, network segmentation, admission control." },
      { step: "03", title: "Runtime Detection", desc: "Deployed Falco across all clusters with custom rule sets, SIEM integration, and automated incident response." },
      { step: "04", title: "SOC 2 Evidence Pipeline", desc: "Automated compliance evidence collection, built audit dashboard, and guided client through Type II assessment." },
    ],
  },
  "fraud-detection-mlops": {
    desc: "Real-time fraud detection processing 10M+ daily transactions at sub-100ms latency — replacing a rules-based system that missed 34% of fraud events with an ML ensemble achieving 99.2% detection accuracy.",
    tags: ["Kafka", "PyTorch", "Apache Flink", "GCP", "Redis", "BigQuery", "Python"],
    stat: "10M+", statLabel: "Daily detections", statPrefix: "", statRaw: 10, statSuffix: "M+",
    industry: "Financial Services", duration: "18 weeks", teamSize: "11 engineers",
    challenge: "A payments processor was losing $4M monthly to fraud that its rule-based system failed to catch — generating 800 false positives per day while missing sophisticated fraud patterns that emerged within hours of new attack vectors.",
    solution: "XERXEZ built a streaming ML fraud detection system on Apache Flink and Kafka evaluating every transaction in under 100ms — using a 3-layer ensemble of graph neural networks, anomaly detection, and behavioural sequence models.",
    results: [
      { metric: "10M+", label: "Transactions monitored daily", raw: 10, suffix: "M+" },
      { metric: "99.2%", label: "Detection accuracy", raw: 99, suffix: "%" },
      { metric: "$4M", label: "Monthly fraud prevented", raw: 4, prefix: "$", suffix: "M" },
    ],
    process: [
      { step: "01", title: "Fraud Pattern Analysis", desc: "Analysed 18 months of transaction data to map 140 fraud patterns across 6 attack categories." },
      { step: "02", title: "Streaming Architecture", desc: "Designed sub-100ms evaluation pipeline on Kafka + Flink with feature engineering at ingestion time." },
      { step: "03", title: "Model Ensemble", desc: "Built and tuned 3-model ensemble — graph network, isolation forest, and LSTM sequence classifier." },
      { step: "04", title: "Shadow Mode & Go-Live", desc: "Ran 6 weeks in shadow mode against production decisions; validated then switched primary system." },
    ],
  },
  "multi-cloud-finops": {
    desc: "FinOps platform delivering $4M+ in annual cloud savings across AWS, Azure, and GCP — combining real-time cost visibility, automated rightsizing, and commitment optimisation for a 12,000-person enterprise.",
    tags: ["Terraform", "Python", "Grafana", "Azure", "AWS", "Snowflake", "dbt"],
    stat: "$4M+", statLabel: "Annual cloud savings", statPrefix: "$", statRaw: 4, statSuffix: "M+",
    industry: "Enterprise Technology", duration: "10 weeks", teamSize: "6 engineers",
    challenge: "An enterprise spending $22M annually across 3 clouds had no unified cost visibility — teams provisioned without accountability, reserved instances were 61% under-utilised, and finance reconciled cloud bills in spreadsheets 3 weeks after month-end.",
    solution: "XERXEZ built a real-time FinOps platform with per-team chargeback, automated rightsizing recommendations, and a commitment coverage engine that continuously optimised reserved capacity across all 3 clouds.",
    results: [
      { metric: "$4M+", label: "Annual cloud savings", raw: 4, prefix: "$", suffix: "M+" },
      { metric: "94%", label: "Reserved coverage rate", raw: 94, suffix: "%" },
      { metric: "22%", label: "Total cloud spend reduced", raw: 22, suffix: "%" },
    ],
    process: [
      { step: "01", title: "Cost Mapping", desc: "Tagged 100% of cloud resources by team and built the first unified cross-cloud cost dashboard." },
      { step: "02", title: "Rightsizing Engine", desc: "Analysed 6 months of utilisation data to identify $1.8M in overprovisioned compute across 3 clouds." },
      { step: "03", title: "Commitment Optimiser", desc: "Built automated reserved instance and savings plan optimiser — coverage increased from 39% to 94%." },
      { step: "04", title: "Chargeback & Culture", desc: "Implemented team-level cost accountability with monthly FinOps reviews and anomaly alerting." },
    ],
  },
  "iot-data-platform": {
    desc: "IoT data management platform ingesting 2B+ events daily from 180,000 sensors across 14 manufacturing sites — with predictive maintenance reducing unplanned downtime by 67%.",
    tags: ["MQTT", "TimescaleDB", "React", "Rust", "Kafka", "Grafana", "InfluxDB"],
    stat: "2B+", statLabel: "Events per day", statPrefix: "", statRaw: 2, statSuffix: "B+",
    industry: "Industrial IoT", duration: "22 weeks", teamSize: "14 engineers",
    challenge: "A global manufacturer had 180,000 industrial sensors generating 2B+ events daily across 14 sites with no platform to aggregate or act on the data. Unplanned equipment failures cost $14M annually in production losses.",
    solution: "XERXEZ built a time-series data platform that ingests, compresses, and analyses sensor streams in real time — with ML-based predictive maintenance models detecting equipment anomalies 4–72 hours before failure.",
    results: [
      { metric: "2B+", label: "Events per day ingested", raw: 2, suffix: "B+" },
      { metric: "67%", label: "Unplanned downtime reduced", raw: 67, suffix: "%" },
      { metric: "$14M", label: "Annual production savings", raw: 14, prefix: "$", suffix: "M" },
    ],
    process: [
      { step: "01", title: "Sensor Audit", desc: "Inventoried 180,000 sensors across 14 sites, prioritised critical assets, and mapped data quality issues." },
      { step: "02", title: "Ingestion Pipeline", desc: "Built MQTT broker network with edge pre-processing and Kafka-based time-series ingestion at 2B events/day." },
      { step: "03", title: "Predictive Models", desc: "Trained per-equipment failure models on 2 years of sensor history and maintenance records." },
      { step: "04", title: "Ops Dashboard", desc: "Built real-time monitoring dashboards for 14 site operations teams with alert routing to maintenance crews." },
    ],
  },
  "llm-engineering-bootcamp": {
    desc: "Intensive 12-week LLM engineering programme graduating 300+ engineers into production-ready AI roles — covering RAG systems, fine-tuning, prompt engineering, and LLM deployment at scale.",
    tags: ["Python", "LangChain", "OpenAI", "Pinecone", "LlamaIndex", "FastAPI", "Hugging Face"],
    stat: "300+", statLabel: "Engineers certified", statPrefix: "", statRaw: 300, statSuffix: "+",
    industry: "Enterprise Training", duration: "12 weeks", teamSize: "5 instructors",
    challenge: "Three enterprise clients had ambitious LLM-powered product roadmaps but engineering teams with no hands-on LLM production experience. Generalist AI courses existed but nothing bridged theory to deploying LLM systems on enterprise infrastructure.",
    solution: "XERXEZ designed a 12-week production-first LLM curriculum where graduates ship a complete RAG system into production by week 10 — covering embeddings, vector databases, prompt engineering, fine-tuning, evaluation, and LLMOps.",
    results: [
      { metric: "300+", label: "Engineers certified", raw: 300, suffix: "+" },
      { metric: "97%", label: "Cohort completion rate", raw: 97, suffix: "%" },
      { metric: "12", label: "Production LLM apps shipped", raw: 12, suffix: "" },
    ],
    process: [
      { step: "01", title: "Cohort Assessment", desc: "Assessed Python, ML, and systems skills across 300+ engineers and grouped cohorts by starting level." },
      { step: "02", title: "Curriculum Build", desc: "Designed 12-week project-first curriculum: embeddings → RAG → fine-tuning → evaluation → LLMOps." },
      { step: "03", title: "Live Cohorts", desc: "Ran 6 cohorts simultaneously across 3 time zones with weekly office hours and code review sessions." },
      { step: "04", title: "Production Deployment", desc: "Each cohort shipped a production LLM application in week 10, certified by senior XERXEZ engineers." },
    ],
  },
  "oil-gas-digital-transformation": {
    desc: "AI-powered digital transformation for a major Oil & Gas operator — predictive maintenance, real-time pipeline monitoring, and operational analytics that increased efficiency by 47% and prevented 3 major equipment failures.",
    tags: ["Oil & Gas", "AI", "IoT", "Azure IoT Hub", "Python", "Power BI", "SCADA"],
    stat: "47%", statLabel: "Efficiency gain", statPrefix: "", statRaw: 47, statSuffix: "%",
    industry: "Oil & Gas", duration: "24 weeks", teamSize: "16 engineers",
    challenge: "A mid-size upstream operator ran 400km of pipeline on manual inspection cycles and reactive maintenance. Three unexpected shutdowns in 18 months cost $22M in lost production and emergency repair — the operations team had no predictive visibility into equipment health.",
    solution: "XERXEZ deployed a unified operational technology platform integrating SCADA, IoT sensors, and ML predictive maintenance — giving operations a single pane of glass with real-time anomaly detection and 72-hour failure prediction for critical assets.",
    results: [
      { metric: "47%", label: "Operational efficiency gain", raw: 47, suffix: "%" },
      { metric: "3", label: "Major failures prevented", raw: 3, suffix: "" },
      { metric: "$22M", label: "Production losses avoided", raw: 22, prefix: "$", suffix: "M" },
    ],
    process: [
      { step: "01", title: "OT/IT Assessment", desc: "Audited 400km pipeline, 12,000 sensors, and 6 SCADA systems to map data flows and integration points." },
      { step: "02", title: "Data Integration Layer", desc: "Built OT/IT convergence layer connecting SCADA historians and maintenance systems into unified data lake." },
      { step: "03", title: "Predictive Models", desc: "Trained failure prediction models on 5 years of SCADA data and maintenance records per asset class." },
      { step: "04", title: "Command Centre", desc: "Deployed real-time operations dashboard with anomaly alerting, risk scoring, and mobile maintenance routing." },
    ],
  },
  "healthcare-management-system": {
    desc: "End-to-end healthcare management platform covering 280,000 patient records, scheduling, billing, and clinical workflows — achieving 99.5% data accuracy and 91% appointment fulfilment across 8 hospital campuses.",
    tags: ["Healthcare", "FHIR R4", "React", "PostgreSQL", "Azure", "ERP", "Cloud"],
    stat: "99.5%", statLabel: "Records accuracy", statPrefix: "", statRaw: 99, statSuffix: "%",
    industry: "Healthcare", duration: "28 weeks", teamSize: "18 engineers",
    challenge: "A regional hospital network managing 8 campuses ran 4 disconnected patient record systems — causing duplicate records, billing errors, scheduling conflicts, and clinical staff spending 3+ hours per shift on data entry across systems that couldn't communicate.",
    solution: "XERXEZ built a unified healthcare management platform with a single FHIR R4-compliant patient record spine, integrated scheduling, real-time bed management, and automated billing — migrating 280,000 records with 99.5% accuracy validation.",
    results: [
      { metric: "99.5%", label: "Patient record accuracy", raw: 99, suffix: "%" },
      { metric: "91%", label: "Appointment fulfilment rate", raw: 91, suffix: "%" },
      { metric: "3h", label: "Clinical time saved per nurse per shift", raw: 3, suffix: "h" },
    ],
    process: [
      { step: "01", title: "Clinical Workflow Analysis", desc: "Shadowed clinical teams across 8 campuses to map 240 workflows and identify the 40 highest-impact automations." },
      { step: "02", title: "FHIR Architecture", desc: "Designed FHIR R4-compliant patient record spine with de-duplication engine and consent management." },
      { step: "03", title: "Data Migration", desc: "Migrated and validated 280,000 patient records from 4 legacy systems with 99.5% accuracy verification." },
      { step: "04", title: "Phased Go-Live", desc: "Campus-by-campus rollout over 12 weeks with 24/7 hypercare support during each site's first 2 weeks." },
    ],
  },
};

function getMeta(slug: string, title: string, category: string): DetailMeta {
  return META[slug] ?? {
    desc: "Enterprise-grade solution delivering measurable business outcomes across operational efficiency, cost reduction, and technology modernisation.",
    tags: ["Python", "AWS", "React", "Kubernetes"],
    stat: "—", statLabel: "Delivered", statPrefix: "", statRaw: 0, statSuffix: "",
    industry: category, duration: "12 weeks", teamSize: "8 engineers",
    challenge: `${title} required modernising the client's existing approach — disconnected legacy systems and manual processes were creating operational bottlenecks limiting growth.`,
    solution: "XERXEZ designed and delivered a modern, scalable solution — covering discovery, architecture, agile delivery, and knowledge transfer to the internal team.",
    results: [
      { metric: "40%", label: "Efficiency improvement", raw: 40, suffix: "%" },
      { metric: "99.9%", label: "System availability", raw: 99, suffix: "%" },
      { metric: "3×", label: "Team productivity", raw: 3, suffix: "×" },
    ],
    process: [
      { step: "01", title: "Discovery", desc: "Stakeholder interviews, process mapping, and technical audit to define success metrics." },
      { step: "02", title: "Architecture", desc: "Solution design and technology selection aligned with security and compliance requirements." },
      { step: "03", title: "Build & Test", desc: "Agile delivery in 2-week sprints with CI/CD, automated testing, and stakeholder reviews." },
      { step: "04", title: "Go-Live & Support", desc: "Phased rollout, knowledge transfer, and 90-day hypercare support period." },
    ],
  };
}

// ── Scroll-reveal wrapper ─────────────────────────────────────────────────
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className,
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.52, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

// ── Animated metric card (count-up on scroll) ─────────────────────────────
const MetricCard: React.FC<{
  result: DetailMeta["results"][0]; trigger: boolean; delay: number;
}> = ({ result, trigger, delay }) => {
  const counted = useCountUp(result.raw, 1700, trigger && result.raw > 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={trigger ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "#fff", borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.06)",
        padding: "28px 20px", textAlign: "center",
        boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
        flex: 1,
      }}
    >
      <div style={{
        fontFamily: "'Cormorant Garamond',serif",
        fontSize: "clamp(30px,3.5vw,42px)",
        fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 10,
      }}>
        {result.raw === 0
          ? result.metric
          : `${result.prefix ?? ""}${counted}${result.suffix ?? ""}`}
      </div>
      <div style={{
        fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, fontWeight: 700,
        color: "#8A7D6E", textTransform: "uppercase", letterSpacing: "0.10em", lineHeight: 1.3,
      }}>
        {result.label}
      </div>
    </motion.div>
  );
};

// ── Main component ────────────────────────────────────────────────────────
interface Props {
  projectInfo: ProjectDataType;
  currentIndex: number;
}

const ProjectDetailSection: React.FC<Props> = ({ projectInfo, currentIndex }) => {
  const navigate = useNavigate();
  const meta = getMeta(projectInfo.slug, projectInfo.title, projectInfo.category);

  const prevItem = projectsData[(currentIndex - 1 + projectsData.length) % projectsData.length];
  const nextItem = projectsData[(currentIndex + 1) % projectsData.length];

  // Hero stat count-up fires after page entrance animation
  const [heroCountTrigger, setHeroCountTrigger] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroCountTrigger(true), 700);
    return () => clearTimeout(t);
  }, [projectInfo.slug]);

  // Hero parallax (image shifts as user scrolls past)
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 50]);

  // 3D tilt on detail image
  const imgCardRef = useRef<HTMLDivElement>(null);
  const onImgMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const el = imgCardRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.transition = "transform 0.08s linear, box-shadow 0.08s linear";
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-5px)`;
    el.style.boxShadow = "0 24px 56px rgba(204,120,92,0.20), 0 6px 20px rgba(0,0,0,0.10), 0 0 0 1.5px rgba(201,136,58,0.40)";
  }, []);
  const onImgLeave = useCallback(() => {
    if (prefersReduced) return;
    const el = imgCardRef.current; if (!el) return;
    el.style.transition = "transform 0.50s cubic-bezier(0.22,1,0.36,1), box-shadow 0.50s ease";
    el.style.transform = "";
    el.style.boxShadow = "";
    setTimeout(() => { if (el) el.style.transition = ""; }, 510);
  }, []);

  // Results section count-up trigger
  const resultsRef = useRef<HTMLDivElement>(null);
  const resultsInView = useInView(resultsRef, { once: true, amount: 0.3 });

  // Hero stat counter
  const heroCount = useCountUp(meta.statRaw, 1800, heroCountTrigger && meta.statRaw > 0);

  return (
    <>
      <style>{`
        @keyframes xzCsOrb1 {
          0%,100% { transform:translate(0,0) scale(1); }
          50%      { transform:translate(-20px,28px) scale(1.06); }
        }
        @keyframes xzCsOrb2 {
          0%,100% { transform:translate(0,0) scale(1); }
          50%      { transform:translate(24px,-18px) scale(0.95); }
        }
        @keyframes xzCsOrb3 {
          0%,100% { transform:translate(0,0) scale(1); }
          50%      { transform:translate(-14px,-20px) scale(1.04); }
        }
        .xz-cs-tag {
          display:inline-block;
          transition: transform 0.26s cubic-bezier(0.22,1,0.36,1),
                      border-color 0.26s ease,
                      background 0.26s ease,
                      box-shadow 0.26s ease;
          will-change:transform;
        }
        .xz-cs-tag:hover {
          transform: translateY(-4px);
          border-color: rgba(201,136,58,0.40) !important;
          background: #F8F5F0 !important;
          box-shadow: 0 6px 16px rgba(201,136,58,0.14);
        }
        .xz-cs-navcard {
          transition: transform 0.28s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.28s ease,
                      border-color 0.28s ease;
        }
        .xz-cs-navcard:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.12) !important;
          border-color: rgba(201,136,58,0.36) !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .xz-cs-tag, .xz-cs-navcard { transition: none !important; }
          .xz-cs-tag:hover { transform: none !important; }
          .xz-cs-navcard:hover { transform: none !important; }
        }
        @media (hover: none) {
          .xz-cs-tag:hover { transform: none !important; box-shadow: none !important; }
          .xz-cs-navcard:hover { transform: none !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════
          HERO — dark, full-width, floating orbs + stat counter
      ══════════════════════════════════════════════════════ */}
      <div ref={heroRef} style={{
        background: `linear-gradient(160deg,${DARK} 0%,${DARKER} 100%)`,
        padding: "80px 0 72px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Animated orbs */}
        {[
          { top: "-22%", left: "-10%", size: 420, color: "rgba(201,136,58,0.16)", anim: "xzCsOrb1 22s ease-in-out infinite" },
          { bottom: "-20%", right: "-8%", size: 300, color: "rgba(204,120,92,0.11)", anim: "xzCsOrb2 28s ease-in-out infinite" },
          { top: "38%", right: "20%", size: 180, color: "rgba(201,136,58,0.07)", anim: "xzCsOrb3 17s ease-in-out infinite" },
        ].map((o, i) => (
          <div key={i} aria-hidden="true" style={{
            position: "absolute",
            top: (o as any).top, left: (o as any).left,
            bottom: (o as any).bottom, right: (o as any).right,
            width: o.size, height: o.size, borderRadius: "50%",
            background: `radial-gradient(circle,${o.color} 0%,transparent 65%)`,
            pointerEvents: "none", animation: o.anim,
          }} />
        ))}
        {/* Dot grid */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.022) 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{ marginBottom: 36 }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.42)",
            }}>
              <Link to="/" style={{ color: "rgba(255,255,255,0.42)", textDecoration: "none", transition: "color 150ms" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9883A")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.42)")}>
                Home
              </Link>
              <span style={{ opacity: 0.3 }}>›</span>
              <Link to="/project" style={{ color: "rgba(255,255,255,0.42)", textDecoration: "none", transition: "color 150ms" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9883A")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.42)")}>
                Portfolio
              </Link>
              <span style={{ opacity: 0.3 }}>›</span>
              <span style={{ color: "rgba(255,255,255,0.65)" }}>{projectInfo.title}</span>
            </div>
          </motion.nav>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "center" }}>
            {/* Left: badge + title + stat */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: "rgba(201,136,58,0.13)", border: "1px solid rgba(201,136,58,0.30)",
                  borderRadius: 999, padding: "5px 14px", marginBottom: 22,
                  fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5B460",
                }}>
                  <i className="fas fa-layer-group" style={{ fontSize: 9 }} />
                  {projectInfo.category} &nbsp;·&nbsp; {meta.industry}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
                  fontSize: "clamp(26px,4vw,54px)", lineHeight: 1.06,
                  color: "#fff", margin: "0 0 28px", letterSpacing: "-0.03em",
                }}
              >
                {projectInfo.title}
              </motion.h1>

              {/* Key outcome stat — counts up on mount */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.32 }}
                style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: "clamp(42px,5.5vw,76px)",
                    fontWeight: 700, color: GOLD, lineHeight: 1,
                  }}>
                    {meta.statRaw > 0
                      ? `${meta.statPrefix}${heroCount}${meta.statSuffix}`
                      : meta.stat}
                  </span>
                </div>
                <div style={{ maxWidth: 180 }}>
                  <div style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700,
                    color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em",
                    textTransform: "uppercase", lineHeight: 1.4,
                  }}>
                    {meta.statLabel}
                  </div>
                  <div style={{ display: "flex", gap: 14, marginTop: 14, flexWrap: "wrap" }}>
                    {[
                      { icon: "fas fa-clock", val: meta.duration },
                      { icon: "fas fa-users", val: meta.teamSize },
                    ].map(({ icon, val }) => (
                      <span key={val} style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        fontFamily: "'DM Sans',sans-serif", fontSize: 11.5,
                        color: "rgba(255,255,255,0.50)",
                      }}>
                        <i className={icon} style={{ color: GOLD, fontSize: 10 }} />
                        {val}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: hero image with parallax + 3D tilt (hidden on small screens via CSS) */}
            <motion.div
              className="d-none d-xl-block"
              initial={{ opacity: 0, scale: 0.96, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: 340, flexShrink: 0 }}
            >
              <motion.div style={{ y: parallaxY }}>
                <div
                  ref={imgCardRef}
                  onMouseMove={onImgMove}
                  onMouseLeave={onImgLeave}
                  style={{
                    borderRadius: 18, overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.40)",
                    cursor: "default",
                    willChange: "transform",
                    border: "1px solid rgba(201,136,58,0.20)",
                  }}
                >
                  <Image
                    src={projectInfo.image}
                    alt={projectInfo.title}
                    width={340} height={220}
                    style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          CONTENT — light background, 8/4 column layout
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: CREAM, padding: "80px 0 96px" }}>
        <div className="container">
          <div className="row g-5">

            {/* ── MAIN COLUMN (8/12) ── */}
            <div className="col-lg-8">

              {/* Detail image */}
              <Reveal delay={0.05}>
                <div style={{ borderRadius: 18, overflow: "hidden", marginBottom: 52,
                  boxShadow: "0 4px 30px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.05)" }}>
                  <Image
                    src={projectInfo.detailImg}
                    alt={projectInfo.title}
                    width={856} height={420}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              </Reveal>

              {/* Description */}
              <Reveal delay={0.08}>
                <p style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: 16, lineHeight: 1.80,
                  color: "#3A3530", marginBottom: 52,
                }}>
                  {meta.desc}
                </p>
              </Reveal>

              {/* Challenge */}
              <Reveal delay={0.06}>
                <div style={{ marginBottom: 44 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: GRAD, display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 4px 0 rgba(150,95,30,0.40)",
                    }}>
                      <i className="fas fa-exclamation-triangle" style={{ color: "#fff", fontSize: 14 }} />
                    </div>
                    <h2 style={{
                      fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
                      fontSize: "clamp(18px,2.5vw,26px)", color: "#1A1208",
                      margin: 0, letterSpacing: "-0.02em",
                    }}>The Challenge</h2>
                  </div>
                  <p style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 14.5,
                    lineHeight: 1.80, color: "#5A5650",
                    paddingLeft: 52,
                  }}>
                    {meta.challenge}
                  </p>
                </div>
              </Reveal>

              {/* Solution */}
              <Reveal delay={0.06}>
                <div style={{ marginBottom: 52 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: GRAD, display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 4px 0 rgba(150,95,30,0.40)",
                    }}>
                      <i className="fas fa-lightbulb" style={{ color: "#fff", fontSize: 14 }} />
                    </div>
                    <h2 style={{
                      fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
                      fontSize: "clamp(18px,2.5vw,26px)", color: "#1A1208",
                      margin: 0, letterSpacing: "-0.02em",
                    }}>Our Solution</h2>
                  </div>
                  <p style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 14.5,
                    lineHeight: 1.80, color: "#5A5650",
                    paddingLeft: 52,
                  }}>
                    {meta.solution}
                  </p>
                </div>
              </Reveal>

              {/* Results — animated count-up on scroll */}
              <Reveal>
                <div style={{ marginBottom: 52 }}>
                  <h2 style={{
                    fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
                    fontSize: "clamp(18px,2.5vw,26px)", color: "#1A1208",
                    margin: "0 0 28px", letterSpacing: "-0.02em",
                  }}>
                    Measurable Results
                  </h2>
                  <div ref={resultsRef} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    {meta.results.map((r, i) => (
                      <MetricCard key={r.label} result={r} trigger={resultsInView} delay={i * 0.10} />
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Tech stack — hover float + glow */}
              <Reveal delay={0.04}>
                <div style={{ marginBottom: 52 }}>
                  <h2 style={{
                    fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
                    fontSize: "clamp(18px,2.5vw,26px)", color: "#1A1208",
                    margin: "0 0 20px", letterSpacing: "-0.02em",
                  }}>
                    Technology Stack
                  </h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {meta.tags.map((tag, i) => (
                      <motion.span
                        key={tag}
                        className="xz-cs-tag"
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.38, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700,
                          color: "#3A3530", background: "#fff",
                          border: "1.5px solid rgba(0,0,0,0.08)",
                          borderRadius: 8, padding: "7px 14px",
                          letterSpacing: "0.02em", cursor: "default",
                        }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Process timeline */}
              <Reveal delay={0.04}>
                <div style={{ marginBottom: 16 }}>
                  <h2 style={{
                    fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
                    fontSize: "clamp(18px,2.5vw,26px)", color: "#1A1208",
                    margin: "0 0 32px", letterSpacing: "-0.02em",
                  }}>
                    How We Did It
                  </h2>

                  <div style={{ position: "relative" }}>
                    {/* Connecting line */}
                    <div aria-hidden="true" style={{
                      position: "absolute", left: 19, top: 40, bottom: 40,
                      width: 2, background: "linear-gradient(to bottom, rgba(201,136,58,0.40), rgba(201,136,58,0.08))",
                    }} />

                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {meta.process.map((step, i) => (
                        <motion.div
                          key={step.step}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 0.46, delay: i * 0.10, ease: [0.22, 1, 0.36, 1] }}
                          style={{ display: "flex", gap: 24, paddingBottom: 32 }}
                        >
                          {/* Step dot */}
                          <div style={{
                            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                            background: GRAD,
                            boxShadow: "0 4px 0 rgba(150,95,30,0.36), 0 6px 14px rgba(201,136,58,0.22)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            zIndex: 1, position: "relative",
                          }}>
                            <span style={{
                              fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 800,
                              color: "#fff", letterSpacing: "0.08em",
                            }}>{step.step}</span>
                          </div>
                          {/* Step content */}
                          <div style={{ paddingTop: 8 }}>
                            <h4 style={{
                              fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
                              fontSize: 15, color: "#1A1208", margin: "0 0 7px", letterSpacing: "-0.01em",
                            }}>
                              {step.title}
                            </h4>
                            <p style={{
                              fontFamily: "'DM Sans',sans-serif", fontSize: 13.5,
                              lineHeight: 1.72, color: "#6B6B6B", margin: 0,
                            }}>
                              {step.desc}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* ── SIDEBAR (4/12) ── */}
            <div className="col-lg-4">
              <div style={{ position: "sticky", top: 100 }}>

                {/* Project info card */}
                <Reveal delay={0.12}>
                  <div style={{
                    background: "#fff", borderRadius: 18,
                    border: "1px solid rgba(0,0,0,0.07)",
                    boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
                    overflow: "hidden", marginBottom: 20,
                  }}>
                    <div style={{ background: GRAD, padding: "20px 24px" }}>
                      <div style={{
                        fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700,
                        color: "rgba(255,255,255,0.65)", letterSpacing: "0.14em",
                        textTransform: "uppercase", marginBottom: 4,
                      }}>Case Study</div>
                      <div style={{
                        fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
                        fontSize: 15, color: "#fff", lineHeight: 1.3,
                      }}>{projectInfo.title}</div>
                    </div>
                    <div style={{ padding: "6px 0" }}>
                      {[
                        { icon: "fas fa-tag", label: "Category", value: projectInfo.category },
                        { icon: "fas fa-industry", label: "Industry", value: meta.industry },
                        { icon: "fas fa-clock", label: "Duration", value: meta.duration },
                        { icon: "fas fa-users", label: "Team", value: meta.teamSize },
                      ].map(({ icon, label, value }) => (
                        <div key={label} style={{
                          display: "flex", alignItems: "flex-start", gap: 14,
                          padding: "14px 24px",
                          borderBottom: "1px solid rgba(0,0,0,0.05)",
                        }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                            background: "rgba(201,136,58,0.08)", display: "flex",
                            alignItems: "center", justifyContent: "center", marginTop: 1,
                          }}>
                            <i className={icon} style={{ color: GOLD, fontSize: 11 }} />
                          </div>
                          <div>
                            <div style={{
                              fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700,
                              color: "#8A7D6E", letterSpacing: "0.10em", textTransform: "uppercase",
                              marginBottom: 2,
                            }}>{label}</div>
                            <div style={{
                              fontFamily: "'DM Sans',sans-serif", fontSize: 13.5,
                              fontWeight: 600, color: "#1A1208",
                            }}>{value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>

                {/* Key metric highlight */}
                <Reveal delay={0.16}>
                  <div style={{
                    background: `linear-gradient(160deg,${DARK} 0%,${DARKER} 100%)`,
                    borderRadius: 18, padding: "28px 24px", marginBottom: 20,
                    border: "1px solid rgba(201,136,58,0.18)", textAlign: "center",
                    position: "relative", overflow: "hidden",
                  }}>
                    <div aria-hidden="true" style={{
                      position: "absolute", inset: 0, pointerEvents: "none",
                      backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.018) 1px,transparent 1px)",
                      backgroundSize: "22px 22px",
                    }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div style={{
                        fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 700,
                        color: GOLD, lineHeight: 1, marginBottom: 8,
                      }}>{meta.stat}</div>
                      <div style={{
                        fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700,
                        color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", textTransform: "uppercase",
                      }}>{meta.statLabel}</div>
                    </div>
                  </div>
                </Reveal>

                {/* Contact CTA */}
                <Reveal delay={0.20}>
                  <div style={{
                    background: "#fff", borderRadius: 18,
                    border: "1px solid rgba(0,0,0,0.07)",
                    padding: "28px 24px",
                    boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
                    textAlign: "center",
                  }}>
                    <i className="fas fa-rocket" style={{ fontSize: 28, color: GOLD, marginBottom: 14, display: "block" }} />
                    <h4 style={{
                      fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
                      fontSize: 16, color: "#1A1208", margin: "0 0 10px", letterSpacing: "-0.01em",
                    }}>Start Your Project</h4>
                    <p style={{
                      fontFamily: "'DM Sans',sans-serif", fontSize: 12.5,
                      color: "#8A7D6E", lineHeight: 1.6, margin: "0 0 20px",
                    }}>
                      Ready to achieve similar results? Let's discuss your challenge.
                    </p>
                    <Link to="/contact" style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: GRAD, color: "#fff",
                      fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13,
                      padding: "12px 22px", borderRadius: 10, textDecoration: "none",
                      boxShadow: "0 4px 0 rgba(150,95,30,0.44), 0 6px 16px rgba(201,136,58,0.24)",
                      minHeight: 44, justifyContent: "center", width: "100%",
                      transition: "opacity 180ms ease",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "0.90")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    >
                      Contact Us <i className="far fa-arrow-right" style={{ fontSize: 11 }} />
                    </Link>
                    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { icon: "fas fa-envelope", val: "info@xerxez.com" },
                        { icon: "fas fa-map-marker-alt", val: "India & UAE — Remote-first" },
                      ].map(({ icon, val }) => (
                        <div key={val} style={{
                          display: "flex", alignItems: "center", gap: 8,
                          fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: "#8A7D6E",
                        }}>
                          <i className={icon} style={{ color: GOLD, fontSize: 10, width: 12 }} />
                          {val}
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PREV / NEXT navigation
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: OFF, borderTop: "1px solid rgba(0,0,0,0.06)", padding: "52px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Previous */}
            <Reveal delay={0}>
              <button
                onClick={() => navigate(`/project/${prevItem.slug}`)}
                className="xz-cs-navcard"
                style={{
                  background: "#fff", borderRadius: 14,
                  border: "1.5px solid rgba(0,0,0,0.08)",
                  padding: "22px 24px", textAlign: "left",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  cursor: "pointer", width: "100%",
                }}
              >
                <div style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700,
                  color: "#8A7D6E", letterSpacing: "0.12em", textTransform: "uppercase",
                  marginBottom: 8, display: "flex", alignItems: "center", gap: 7,
                }}>
                  <i className="fas fa-chevron-left" style={{ fontSize: 9 }} />
                  Previous Project
                </div>
                <div style={{
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14,
                  color: "#1A1208", lineHeight: 1.3,
                }}>{prevItem.title}</div>
                <div style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: GOLD,
                  fontWeight: 600, marginTop: 6,
                }}>{prevItem.category}</div>
              </button>
            </Reveal>

            {/* Next */}
            <Reveal delay={0.06}>
              <button
                onClick={() => navigate(`/project/${nextItem.slug}`)}
                className="xz-cs-navcard"
                style={{
                  background: "#fff", borderRadius: 14,
                  border: "1.5px solid rgba(0,0,0,0.08)",
                  padding: "22px 24px", textAlign: "right",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  cursor: "pointer", width: "100%",
                }}
              >
                <div style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700,
                  color: "#8A7D6E", letterSpacing: "0.12em", textTransform: "uppercase",
                  marginBottom: 8, display: "flex", alignItems: "center", gap: 7,
                  justifyContent: "flex-end",
                }}>
                  Next Project
                  <i className="fas fa-chevron-right" style={{ fontSize: 9 }} />
                </div>
                <div style={{
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14,
                  color: "#1A1208", lineHeight: 1.3,
                }}>{nextItem.title}</div>
                <div style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: GOLD,
                  fontWeight: 600, marginTop: 6,
                }}>{nextItem.category}</div>
              </button>
            </Reveal>
          </div>

          {/* Back to portfolio */}
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link to="/project" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
              color: C, textDecoration: "none",
              transition: "gap 0.2s ease",
            }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.gap = "12px")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.gap = "8px")}
            >
              <i className="far fa-arrow-left" style={{ fontSize: 11 }} />
              Back to All Projects
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectDetailSection;

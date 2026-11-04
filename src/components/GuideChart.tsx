import { useId } from "react";
import { formatGuideChartValue, guideChartBarWidth, type GuideChartData } from "@/lib/guide-chart";

export default function GuideChart({ chart }: { chart: GuideChartData }) {
  const titleId = useId();
  const maximum = Math.max(...chart.items.map(item => item.value));
  const zero = formatGuideChartValue(0, chart.format);
  return <figure className="eg-chart" aria-labelledby={titleId}>
    <figcaption>
      <strong id={titleId} className="eg-chart-title">{chart.title}</strong>
      {chart.description ? <p className="eg-chart-description">{chart.description}</p> : null}
    </figcaption>
    <div className="eg-chart-axis" aria-hidden="true"><span>{zero}</span><span>{maximum > 0 ? formatGuideChartValue(maximum, chart.format) : `All values are ${zero}`}</span></div>
    <ul className="eg-chart-values" aria-label="Chart values">
      {chart.items.map((item, index) => <li className="eg-chart-row" key={index}>
        <div className="eg-chart-label"><span>{item.label}</span><strong>{formatGuideChartValue(item.value, chart.format)}</strong></div>
        <div className="eg-chart-track" aria-hidden="true"><span className="eg-chart-bar" style={{ width: `${guideChartBarWidth(item.value, maximum)}%` }} /></div>
      </li>)}
    </ul>
    <p className="eg-chart-note">{chart.note}</p>
  </figure>;
}

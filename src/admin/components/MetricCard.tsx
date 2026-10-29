import React from "react"
import { Icon } from "../../components/common/Icon"
import { IconName } from "../../types"

interface MetricCardProps {
  label: string
  value: string | number
  subtext?: string
  icon?: IconName
  trend?: string
  trendPositive?: boolean
  accentColor?: string
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon,
  trend,
  trendPositive = true,
  accentColor = "text-[#aa8b5f]",
}) => {
  return (
    <div className="bg-[#1f1d17] p-5 border border-[#332f27] hover:border-[#4a4437] transition-all shadow-xs relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <p className="text-[11px] uppercase tracking-widest text-[#8c8273] font-semibold mb-1">
          {label}
        </p>
        {icon && (
          <div className="w-8 h-8 rounded-xs bg-[#171713] border border-[#2d2a24] flex items-center justify-center text-[#aa8b5f] group-hover:border-[#aa8b5f]/40 transition-colors">
            <Icon name={icon} size={16} />
          </div>
        )}
      </div>

      <h3
        className={`font-['Cormorant_Garamond',serif] text-3xl md:text-4xl ${accentColor} my-1`}
      >
        {value}
      </h3>

      <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-[#2d2a24]">
        {subtext && <span className="text-[#70695c] truncate">{subtext}</span>}
        {trend && (
          <span
            className={`font-medium ml-auto px-1.5 py-0.5 rounded-xs text-[10px] ${
              trendPositive
                ? "text-[#81c784] bg-[#81c784]/10"
                : "text-[#e57373] bg-[#e57373]/10"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}

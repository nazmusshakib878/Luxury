import React, { useState } from "react"
import { Icon } from "../../components/common/Icon"
import { ProductReview } from "../../types"

interface ReviewsPageProps {
  reviews: ProductReview[]
  onUpdateReviewStatus: (
    id: string,
    status: ProductReview["status"],
  ) => Promise<boolean>
  onDeleteReview: (id: string) => Promise<boolean>
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({
  reviews,
  onUpdateReviewStatus,
  onDeleteReview,
}) => {
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all")

  const filteredReviews = reviews.filter((r) => {
    if (filter === "all") return true
    return r.status === filter
  })

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#171713] p-4 sm:p-6 border border-[#2d2a24]">
        <div>
          <h3 className="font-['Cormorant_Garamond',serif] text-2xl text-white m-0">
            Patron Testimonials & Product Reviews
          </h3>
          <p className="text-xs text-[#8c8273] m-0 mt-0.5">
            Moderate luxury client impressions displayed on product detail
            pages.
          </p>
        </div>

        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xs font-semibold uppercase tracking-wider text-[11px] cursor-pointer ${
              filter === "all"
                ? "bg-[#aa8b5f] text-[#171713]"
                : "text-[#8c8273] hover:text-white"
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-3 py-1.5 rounded-xs font-semibold uppercase tracking-wider text-[11px] cursor-pointer ${
              filter === "approved"
                ? "bg-[#4caf50] text-white"
                : "text-[#81c784] hover:bg-[#4caf50]/10"
            }`}
          >
            Approved ({reviews.filter((r) => r.status === "approved").length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-xs font-semibold uppercase tracking-wider text-[11px] cursor-pointer ${
              filter === "pending"
                ? "bg-[#ff9800] text-[#171713]"
                : "text-[#ffb74d] hover:bg-[#ff9800]/10"
            }`}
          >
            Pending ({reviews.filter((r) => r.status === "pending").length})
          </button>
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center bg-[#171713] border border-[#2d2a24]">
            <p className="text-xs text-[#8c8273]">
              No customer reviews found matching filter.
            </p>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-[#171713] border border-[#2d2a24] hover:border-[#3d382e] transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#24211b]">
                <div>
                  <strong className="text-white text-sm block">
                    {rev.customerName}
                  </strong>
                  <span className="text-[11px] text-[#aa8b5f]">
                    Reviewed: <strong>{rev.productName}</strong> ·{" "}
                    {rev.createdAt}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Star Rating */}
                  <div className="flex text-[#aa8b5f]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon
                        key={i}
                        name="star"
                        size={14}
                        filled={i < rev.rating}
                      />
                    ))}
                  </div>

                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider border ${
                      rev.status === "approved"
                        ? "bg-[#4caf50]/15 text-[#81c784] border-[#4caf50]/40"
                        : rev.status === "rejected"
                          ? "bg-[#e53935]/15 text-[#ef5350] border-[#e53935]/40"
                          : "bg-[#ff9800]/15 text-[#ffb74d] border-[#ff9800]/40"
                    }`}
                  >
                    {rev.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#c2bcaf] italic leading-relaxed m-0">
                "{rev.comment}"
              </p>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#24211b] text-xs">
                {rev.status !== "approved" && (
                  <button
                    onClick={() => onUpdateReviewStatus(rev.id, "approved")}
                    className="px-3 py-1 bg-[#4caf50]/15 hover:bg-[#4caf50] text-[#81c784] hover:text-[#171713] border border-[#4caf50]/40 text-[10px] uppercase font-semibold tracking-wider rounded-xs cursor-pointer transition-colors"
                  >
                    Approve
                  </button>
                )}
                {rev.status !== "rejected" && (
                  <button
                    onClick={() => onUpdateReviewStatus(rev.id, "rejected")}
                    className="px-3 py-1 bg-[#ff9800]/15 hover:bg-[#ff9800] text-[#ffb74d] hover:text-[#171713] border border-[#ff9800]/40 text-[10px] uppercase font-semibold tracking-wider rounded-xs cursor-pointer transition-colors"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => onDeleteReview(rev.id)}
                  className="px-3 py-1 bg-[#e53935]/15 hover:bg-[#e53935] text-[#ef5350] hover:text-white border border-[#e53935]/40 text-[10px] uppercase font-semibold tracking-wider rounded-xs cursor-pointer transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

package com.tiffin.tiffin_management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatsResponse {
    private long total;
    private long placed;
    private long preparing;
    private long delivered;
    private long cancelled;
}

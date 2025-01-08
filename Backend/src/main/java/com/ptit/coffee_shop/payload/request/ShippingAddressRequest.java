package com.ptit.coffee_shop.payload.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ptit.coffee_shop.common.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ShippingAddressRequest {
    @JsonProperty("id")
    private long id;

    @JsonProperty("receiver_name")
    private String receiverName;

    @JsonProperty("receiver_phone")
    private String receiverPhone;

    @JsonProperty("location")
    private String location;

    @JsonProperty("status")
    private Status status;

    @JsonProperty("user_id")
    private Long userId;

}

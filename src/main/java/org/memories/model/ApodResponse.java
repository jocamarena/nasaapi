package org.memories.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Represents the response from NASA's Astronomy Picture of the Day (APOD) API.
 */
public record ApodResponse(
    String copyright,
    String date,
    String explanation,
    @JsonProperty("hdurl")
    String hdUrl,
    @JsonProperty("media_type")
    String mediaType,
    @JsonProperty("service_version")
    String serviceVersion,
    String title,
    String url
) {
}

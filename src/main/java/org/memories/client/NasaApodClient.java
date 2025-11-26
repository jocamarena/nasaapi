package org.memories.client;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.memories.model.ApodResponse;

import java.util.List;

/**
 * REST client for NASA's Astronomy Picture of the Day (APOD) API.
 */
@RegisterRestClient(configKey = "nasa-apod-api")
public interface NasaApodClient {

    /**
     * Retrieves the APOD for today.
     *
     * @param apiKey NASA API key
     * @return APOD response
     */
    @GET
    @Path("/planetary/apod")
    ApodResponse getApod(@QueryParam("api_key") String apiKey);

    /**
     * Retrieves the APOD for a specific date.
     *
     * @param apiKey NASA API key
     * @param date   Date in yyyy-MM-dd format
     * @return APOD response
     */
    @GET
    @Path("/planetary/apod")
    ApodResponse getApodByDate(@QueryParam("api_key") String apiKey,
                                @QueryParam("date") String date);

    /**
     * Retrieves APODs for a date range.
     *
     * @param apiKey    NASA API key
     * @param startDate Start date in yyyy-MM-dd format
     * @param endDate   End date in yyyy-MM-dd format
     * @return List of APOD responses
     */
    @GET
    @Path("/planetary/apod")
    List<ApodResponse> getApodByDateRange(@QueryParam("api_key") String apiKey,
                                           @QueryParam("start_date") String startDate,
                                           @QueryParam("end_date") String endDate);
}

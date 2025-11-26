package org.memories.controller;

import io.quarkus.qute.Template;
import io.quarkus.qute.TemplateInstance;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.memories.client.NasaApodClient;
import org.memories.model.ApodResponse;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

/**
 * REST controller for retrieving Astronomy Picture of the Day.
 */
@Path("/apod")
public class ApodController {

    @Inject
    @RestClient
    NasaApodClient nasaApodClient;

    @ConfigProperty(name = "nasa.api.key")
    String apiKey;

    @Inject
    Template apod;

    // NASA APOD API started on June 16, 1995
    private static final LocalDate MIN_DATE = LocalDate.of(1995, 6, 16);

    /**
     * Validates that a date string is within the valid range.
     *
     * @param dateString Date string in yyyy-MM-dd format
     * @param fieldName  Name of the field for error message
     * @throws BadRequestException if date is out of range or invalid
     */
    private void validateDateInRange(String dateString, String fieldName) {
        if (dateString == null || dateString.isEmpty()) {
            return;
        }

        try {
            LocalDate selectedDate = LocalDate.parse(dateString);
            LocalDate today = LocalDate.now();

            if (selectedDate.isBefore(MIN_DATE)) {
                throw new BadRequestException(
                    fieldName + " cannot be before June 16, 1995."
                );
            }

            if (selectedDate.isAfter(today)) {
                throw new BadRequestException(
                    fieldName + " cannot be in the future. Please select today or an earlier date."
                );
            }
        } catch (java.time.format.DateTimeParseException e) {
            throw new BadRequestException(
                fieldName + " must be in yyyy-MM-dd format."
            );
        }
    }

    /**
     * Retrieves APOD data with optional date parameters.
     *
     * @param date      Optional single date (yyyy-MM-dd)
     * @param startDate Optional start date for range (yyyy-MM-dd)
     * @param endDate   Optional end date for range (yyyy-MM-dd)
     * @return List of APOD responses
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<ApodResponse> getApod(@QueryParam("date") String date,
                                       @QueryParam("start_date") String startDate,
                                       @QueryParam("end_date") String endDate) {
        // Validate dates are in valid range
        validateDateInRange(date, "Date");
        validateDateInRange(startDate, "Start date");
        validateDateInRange(endDate, "End date");

        // Validate date range logic
        if (startDate != null && endDate != null) {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            if (start.isAfter(end)) {
                throw new BadRequestException("Start date cannot be after end date.");
            }
            return nasaApodClient.getApodByDateRange(apiKey, startDate, endDate);
        } else if (date != null) {
            return Collections.singletonList(nasaApodClient.getApodByDate(apiKey, date));
        } else {
            return Collections.singletonList(nasaApodClient.getApod(apiKey));
        }
    }

    /**
     * Renders APOD in HTML with optional date parameters.
     *
     * @param date      Optional single date (yyyy-MM-dd)
     * @param startDate Optional start date for range (yyyy-MM-dd)
     * @param endDate   Optional end date for range (yyyy-MM-dd)
     * @return Rendered HTML template
     */
    @GET
    @Path("/view")
    @Produces(MediaType.TEXT_HTML)
    public TemplateInstance viewApod(@QueryParam("date") String date,
                                      @QueryParam("start_date") String startDate,
                                      @QueryParam("end_date") String endDate) {
        try {
            // Validate dates are in valid range
            validateDateInRange(date, "Date");
            validateDateInRange(startDate, "Start date");
            validateDateInRange(endDate, "End date");

            // Validate date range logic
            if (startDate != null && endDate != null) {
                LocalDate start = LocalDate.parse(startDate);
                LocalDate end = LocalDate.parse(endDate);
                if (start.isAfter(end)) {
                    throw new BadRequestException("Start date cannot be after end date.");
                }
            }

            List<ApodResponse> responses;
            if (startDate != null && endDate != null) {
                responses = nasaApodClient.getApodByDateRange(apiKey, startDate, endDate);
            } else if (date != null) {
                responses = Collections.singletonList(nasaApodClient.getApodByDate(apiKey, date));
            } else {
                responses = Collections.singletonList(nasaApodClient.getApod(apiKey));
            }
            return apod.data("apods", responses).data("error", null);
        } catch (BadRequestException e) {
            // Handle validation errors gracefully - return today's APOD with error message
            List<ApodResponse> todayApod = Collections.singletonList(nasaApodClient.getApod(apiKey));
            return apod.data("apods", todayApod).data("error", e.getMessage());
        } catch (Exception e) {
            // Handle other errors - return today's APOD with generic error message
            List<ApodResponse> todayApod = Collections.singletonList(nasaApodClient.getApod(apiKey));
            return apod.data("apods", todayApod)
                      .data("error", "An error occurred while retrieving the APOD. Showing today's APOD instead.");
        }
    }
}

package helpinghands.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 
 *
 * @version 1.0
 *
 */
public class DateParser {
	
	/**
	 * Formatting of a Date object to only display yyyy-MM format
	 * Mainly used for formatting the date for invoice generation
	 * @param date
	 * @return A String that will be displayed in the following format (e.g. 2017-11)
	 */
	public static String displayMonthYearOnly(Date date) {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM");
		return format.format(date);
	}
	
	/**
	 * Formatting a Date object into a String that will display the dd-MM-yyyy format
	 * @param date
	 * @return A String that will be displayed in the following format (e.g. 03-11-2017)
	 */
	public static String formatDateToString(Date date) {
		SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy");
		return format.format(date);
	}
	
	/**
	 * Formatting a Date object into a String that will display the HH:mm format
	 * @param date
	 * @return A String that will be displayed in the following format (e.g. 23:00)
	 */
	public static String formatTimeToString(Date date) {
		SimpleDateFormat format = new SimpleDateFormat("HH:mm");
		return format.format(date);
	}
	
	/**
	 * Converting a String into a Date object
	 * @param time
	 * @return A Date object that has been formatted to only show the hour & minutes
	 * @throws ParseException
	 */
	public static Date convertStringToTime(String time) throws ParseException {
		SimpleDateFormat format = new SimpleDateFormat("HH:mm");
		Date dateObject = null;
		dateObject = format.parse(time);
		return dateObject;
	}
	
	/**
	 * Converting a String into a Date object
	 * @param date
	 * @return A Date object that has been formatted to only show the day, month and year
	 * @throws ParseException
	 */
	public static Date convertStringToDate(String date) throws ParseException {
		SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy");
		Date dateObject = null;
		dateObject = format.parse(date);
		return dateObject;
	}
	
}

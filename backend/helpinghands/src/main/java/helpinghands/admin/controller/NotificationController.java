package helpinghands.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import helpinghands.inventory.entity.DonationItem;
import helpinghands.inventory.repository.FoodRepository;

import java.util.List;

import javax.transaction.Transactional;

/**
 * 
 *
 * @version 1.0
 *
 */
@RestController
@CrossOrigin
@Transactional
public class NotificationController {

	/**
	 * Dependency injection
	 */
	@Autowired
	private FoodRepository foodRepository;
	
	/**
	 * Dependency injection
	 */
	@Autowired
	private SimpMessagingTemplate template;
	
	//public static final Map<String, Boolean> notifications = Collections.synchronizedMap(new HashMap<String, Boolean>());
	
	@Autowired
	NotificationController(SimpMessagingTemplate template) {
		this.template = template;
	}
	
	/**
	 * Helper method to evaluate the inventory quantity, and pushing it to the client
	 */
	@MessageMapping("/server/notifications")
	@SendTo("/client/notifications")
	@Scheduled(fixedRate = 5000)
	public void retrieveNotifications() {
		evaluateInventoryValue();
	}
	
	/**
	 * Method that is scheduled to run in intervals of 10000 milliseconds to evaluate if the food repository contains any items with a value of 0
	 */
	public void evaluateInventoryValue() {
		Boolean notificationPopup = Boolean.FALSE;
		List<DonationItem> foodItems = foodRepository.findByValueEquals(Double.valueOf(0));
		if(!foodItems.isEmpty()) {
			notificationPopup = Boolean.TRUE;
		}
		this.template.convertAndSend("/client/notifications", notificationPopup);
	}
}

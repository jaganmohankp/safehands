package helpinghands.allocation.entity;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;

import helpinghands.inventory.entity.DonationItem;

/**
 * 
 *
 * @version 1.0
 *
 */
@Entity
public class AllocatedFoodItem {
	
	/**
	 * The identifier that will be created automatically by the database's sequence generator as specified
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "all_fi_seq_gen")
	@SequenceGenerator(allocationSize = 1, initialValue = 1, name = "all_fi_seq_gen", sequenceName = "allocated_food_item_sequence")
	private Long id;
	
	/**
	 * Each allocated food item will have to be mapped to a food item that is present in the inventory repository
	 */
	@ManyToOne(cascade = CascadeType.ALL, 
			fetch = FetchType.LAZY, 
			optional = true, targetEntity = DonationItem.class)
	@JoinColumn(name = "inventory_id", nullable = true)
	private DonationItem allocatedFoodItem;
	
	/**
	 * Represents the initial requested quantity for the specified food item that is being allocated and represented
	 */
	private Integer requestedQuantity;
	
	/**
	 * Represents the allocated quantity for the specified food item that is being allocated and represented
	 */
	private Integer allocatedQuantity;
	
	/**
	 * Each allocated food item belongs to an Allocation object
	 */
	@ManyToOne
	@JoinColumn(name = "allocation_id")
	private Allocation allocation;
	
	/**
	 * Empty constructor that should not be used in most instances
	 */
	protected AllocatedFoodItem() {}

	/**
	 * Constructor that allows creation of an allocated food item with all the required variables
	 * @param foodItem
	 * @param requestedQuantity
	 * @param allocatedQuantity
	 */
	public AllocatedFoodItem(DonationItem foodItem, Integer requestedQuantity, Integer allocatedQuantity) {
		this.allocatedFoodItem = foodItem;
		this.requestedQuantity = requestedQuantity;
		this.allocatedQuantity = allocatedQuantity;
	}
	
	/**
	 * 
	 * @return DonationItem Object that represents the underlying inventory that is being allocated
	 */
	public DonationItem getFoodItem() {
		return allocatedFoodItem;
	}
	
	/**
	 * Setter method that sets the underlying inventory that is being allocated to the food item that is specified
	 * @param foodItem
	 */
	public void setFoodItem(DonationItem foodItem) {
		this.allocatedFoodItem = foodItem;
	}
	
	/**
	 * 
	 * @return An Integer value that represents the requested quantity of the underlying food item
	 */
	public Integer getRequestedQuantity() {
		return requestedQuantity;
	}
	
	/**
	 * Setter method that updates the requested quantity of the underlying food item
	 * @param requestedQuantity
	 */
	public void setRequestedQuantity(Integer requestedQuantity) {
		this.requestedQuantity = requestedQuantity;
	}
	
	/**
	 * 
	 * @return An Integer value that represents the allocated quantity of the underlying food item
	 */
	public Integer getAllocatedQuantity() {
		return allocatedQuantity;
	}
	
	/**
	 * Setter method that updates the allocated quantity of the underlying food item
	 * @param allocatedQuantity
	 */
	public void setAllocatedQuantity(Integer allocatedQuantity) {
		this.allocatedQuantity = allocatedQuantity;
	}
	
	/**
	 * 
	 * @return Allocation object that contains the existing allocated food item
	 */
	public Allocation getAllocation() {
		return allocation;
	}
	
	/**
	 * Setter method to specify the Allocation object that the existing allocated food item belongs to
	 * @param allocation
	 */
	public void setAllocation(Allocation allocation) {
		this.allocation = allocation;
	}

}

package helpinghands.allocation.entity;

import java.util.List;

import javax.persistence.CascadeType;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;


import helpinghands.beneficiary.entity.Beneficiary;


/**
 * 
 *
 * @version 1.0
 *
 */
@Entity
@Table(name = "allocation")
public class Allocation {
	
	/**
	 * The identifier that will be created automatically by the database's sequence generator as specified
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "alloc_seq_gen")
	@SequenceGenerator(initialValue = 1, allocationSize = 1, name = "alloc_seq_gen", sequenceName = "allocation_sequence")
	private Long id;
	
	/**
	 * The beneficiary object that owns the allocation
	 * The beneficiary object can only have one allocation at any point in time
	 */
	@OneToOne(//cascade = CascadeType.ALL,
			fetch = FetchType.LAZY,
			orphanRemoval = true,
			optional = true, targetEntity = Beneficiary.class)
	@JoinColumn(name = "beneficiary_user_id")
	private Beneficiary beneficiary;
	
	/**
	 * The list of allocated food items that is represented by this allocation
	 */
	@OneToMany(mappedBy = "allocation", 
			cascade = CascadeType.ALL, 
			fetch = FetchType.LAZY, orphanRemoval = true)
	private List<AllocatedFoodItem> allocatedItems;
	
	/**
	 * The approval status of the entire allocation
	 * TRUE if the allocation is approved, FALSE otherwise
	 */
	private Boolean approvalStatus;
	
	/**
	 * Empty constructor that should not be used in most instances
	 * Required for Spring injection
	 */
	protected Allocation() {}

	/**
	 * Constructor that initializes the Allocation object with all required variables
	 * @param beneficiary
	 * @param allocatedItems
	 * @param approvalStatus
	 */
	public Allocation(Beneficiary beneficiary, List<AllocatedFoodItem> allocatedItems, Boolean approvalStatus) {
		this.beneficiary = beneficiary;
		this.allocatedItems = allocatedItems;
		this.approvalStatus = approvalStatus;
	}
	
	/**
	 * 
	 * @return Long that represents the Id as stored within the database
	 */
	public Long getId() {
		return id;
	}
	
	/**
	 * Setter method that sets the Id to the specified value
	 * @param id
	 */
	public void setId(Long id) {
		this.id = id;
	}
	
	/**
	 * 
	 * @return Beneficiary object that owns the Allocation
	 */
	public Beneficiary getBeneficiary() {
		return beneficiary;
	}
	
	/**
	 * Setter method that modifies the owner of the Allocation
	 * This method should not be used elsewhere, except for when the Allocation is created
	 * @param beneficiary
	 */
	public void setBeneficiary(Beneficiary beneficiary) {
		this.beneficiary = beneficiary;
	}
	
	/**
	 * 
	 * @return List of AllocatedFoodItem that is owned by this Allocation
	 */
	public List<AllocatedFoodItem> getAllocatedItems() {
		return allocatedItems;
	}
	
	/**
	 * Setter method that modifies the List of AllocatedFoodItem that is owned by this Allocation
	 * @param allocatedItems
	 */
	public void setAllocatedItems(List<AllocatedFoodItem> allocatedItems) {
		this.allocatedItems = allocatedItems;
	}
	
	/**
	 * 
	 * @return Boolean value that represents the approval status of the allocation, TRUE if approved, FALSE otherwise
	 */
	public Boolean getApprovalStatus() {
		return approvalStatus;
	}
	
	/**
	 * Setter method that modifies the approval status of this Allocation
	 * @param approvalStatus
	 */
	public void setApprovalStatus(Boolean approvalStatus) {
		this.approvalStatus = approvalStatus;
	}
	
}

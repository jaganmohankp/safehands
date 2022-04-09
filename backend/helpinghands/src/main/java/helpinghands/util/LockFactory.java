package helpinghands.util;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * 
 *
 * @version 1.0
 *
 */
public class LockFactory {
	
	/**
	 * A concurrent hashmap that manages all the existing locks that may/may not be active
	 */
	private static final Map<String, Object> LOCKFACTORY = new ConcurrentHashMap<String, Object>();
	
	/**
	 * Retrieving of a lock as specified by its name
	 * @param lockName
	 * @return The respective ReadWriteLock
	 */
	public static ReadWriteLock getWriteLock(String lockName) {
		
		ReadWriteLock lock = (ReadWriteLock) LOCKFACTORY.putIfAbsent(lockName, new ReentrantReadWriteLock());
		if(lock == null) { lock = (ReadWriteLock) LOCKFACTORY.get(lockName); }
		return lock;
		
	}

}

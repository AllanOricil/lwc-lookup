public with sharing class LookupController {
  public class SObjectDoesNotExistException extends Exception {
  }

  @AuraEnabled(cacheable=true)
  public static List<SObject> fetchSObjectResults(
    String sobjectName,
    String searchInput,
    Integer maxNumberOfResults
  ) {
    if (!LookupController.validateSObjectName(sobjectName))
      throw new SObjectDoesNotExistException(
        'SObject ' +
        sobjectName +
        ' does not exist.'
      );
    String searchInputLikeClause = '%' + searchInput + '%';
    String query =
      'SELECT Id, Name FROM ' +
      sobjectName +
      ' WHERE Name LIKE :searchInputLikeClause LIMIT :maxNumberOfResults';
    return Database.query(query);
  }

  @AuraEnabled(cacheable=true)
  public static List<SObject> fetchRecentlyViewed(
    String sobjectName,
    Integer maxNumberOfResults
  ) {
    if (!LookupController.validateSObjectName(sobjectName))
      throw new SObjectDoesNotExistException(
        'SObject ' +
        sobjectName +
        ' does not exist.'
      );
    String query = 'SELECT Id, Name FROM RecentlyViewed WHERE Type =: sobjectName ORDER BY LastViewedDate DESC LIMIT :maxNumberOfResults';
    return Database.query(query);
  }

  private static boolean validateSObjectName(String sobjectName) {
    for (Schema.SObjectType sObjectType : Schema.getGlobalDescribe().values()) {
      String sobjectTypeName = String.valueOf(sObjectType);
      if (sobjectTypeName.contains(sobjectName)) {
        return true;
      }
    }
    return false;
  }
}

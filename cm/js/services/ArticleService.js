angular.module('ArticleService', []).factory('Article', ['$http', function($http) {

	return {
		get: function() {
			return $http.get('/api/articles');

		},

		create: function(articleData) {
			return $http.post('/api/articles', articleData);
		},

		delete: function(id) {
			return $http.delete('/api/articles/' + id);
		}

	};



}]);
const SearchHelper = () => {
    const searchObj = (options) => {
        // return false
        let searchResult = []
        if (!options.value.query || options.value === '') {
            return options.list
        } else {
               searchResult = options.list
               const query_keys = Object.keys(options.value.query || {})
                for (let i = 0; i < Object.values(query_keys).length; i++) {
                        searchResult = searchResult.filter(data => data[query_keys[i]] && data[query_keys[i]].toLowerCase().includes((options.value.query[query_keys[i]]).toLowerCase()))
                }
                return searchResult 
        }
        
    }

    return {
        searchObj
    }
}
export default SearchHelper
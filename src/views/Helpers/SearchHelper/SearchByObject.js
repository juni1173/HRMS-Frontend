const SearchHelper = () => {
    const searchObj = (options) => {
        console.warn(options)
        // return false
        if (!options.value) return options.list
        const searchResult =  options.list.filter(data => data[options.key].toLowerCase().includes((options.value).toLowerCase()))
        return searchResult
    }

    return {
        searchObj
    }
}
export default SearchHelper
 
export const ButtonSign_out = () => {
  return (
  <div className={`p-4 border-t border-blue-800/30 ${expanded ? '' : 'flex justify-center'}`}>
        <button 

        onClick={()=>logout()}
          className={`cursor-pointer flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-amber-500 transition-all duration-300 hover:bg-red-600 hover:text-white ${expanded ? '' : 'justify-center'}`}
        >
          <LogOut size={20} />
          {expanded && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-medium"
            >
              Sign Out
            </motion.span>
          )}
        </button>
      </div>
  )
}

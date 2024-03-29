import { MENU_ITEMS } from "@/constants";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { menuItemClick,actionItemClick} from '@/Slice/menuSlice'


const Board = () =>{

    const dispatch = useDispatch()

    const {activeMenuItem,actionMenuItem} = useSelector((state) => state.menu)
    const {color , size } = useSelector((state) => state.toolbox[activeMenuItem])

    const canvasRef = useRef(null);
    const shouldDraw = useRef(false);
    const history = useRef([]);
    const pointer = useRef(0);

    useEffect(()=>{
        if(!canvasRef.current) return
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        if(actionMenuItem === MENU_ITEMS.DOWNLOAD){
            const url = canvas.toDataURL();
            const anchor = document.createElement('a')
             anchor.href = url;
             anchor.download = 'yoursketch.jpg'
             anchor.click()
            console.log(url)
        }else if(actionMenuItem === MENU_ITEMS.UNDO || actionMenuItem === MENU_ITEMS.REDO){
            
            if(pointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO) pointer.current = pointer.current -1;
            if(pointer.current < history.current.length -1 && actionMenuItem === MENU_ITEMS.REDO) pointer.current = pointer.current + 1;
            const imageData = history.current[pointer.current];
            context.putImageData(imageData, 0 , 0);
            console.log("Decrement",pointer.current)
        }
        console.log("actionMenuItem",actionMenuItem)
        dispatch(actionItemClick(null))
    },[actionMenuItem,dispatch])
  
    useEffect(()=>{
        if(!canvasRef.current) return
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        

        const change = ()=>{
            context.strokeStyle = color;
            context.lineWidth = size;
        }

        change();

      
        
    },[color,size])


    useLayoutEffect(()=>{
        if(!canvasRef.current) return
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        //wehn mounting component 
        canvas.width = window.innerWidth
        canvas.height= window.innerHeight
        const beginPath = (x,y)=>{
            context.beginPath()
            context.moveTo(x,y)
        }
    
        const drawLine=(x,y)=>{
            context.lineTo(x,y)
            context.stroke()
        }

        const handleMouseDown=(e)=>{
            shouldDraw.current=true
            beginPath(e.clientX, e.clientY)
          
        }

        const handleMouseUp=(e)=>{
            shouldDraw.current= false
            const imageData = context.getImageData(0,0,canvas.width, canvas.height);
            history.current.push(imageData);
            console.log(history);
            pointer.current = history.current.length - 1;
            console.log("length",pointer.current )
        }

        const handleMouseMove=(e)=>{
            if(!shouldDraw.current) return
            drawLine(e.clientX, e.clientY)
            
        }

        canvas.addEventListener('mousedown', handleMouseDown)
        canvas.addEventListener('mousemove', handleMouseMove)
        canvas.addEventListener('mouseup', handleMouseUp)

        return ()=>{
            canvas.removeEventListener('mousedown', handleMouseDown)
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseup', handleMouseUp)
        }

    },[])

    console.log(color,size)
    return (<canvas ref = {canvasRef}></canvas>)
}

export default Board;
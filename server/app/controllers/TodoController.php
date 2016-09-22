<?php

class TodoController extends Controller {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $headers = getallheaders();
        if($headers['token'] == Session::get('token'))
        {
            $messages = DB::table('messages')->get();
            foreach ($messages as $key => $message)
            {
                $message->time = date('H:i A j M, Y',$message->time);
            }
            echo json_encode(array('status' => 200,'messages' => $messages));
        }
        else
        {
            echo json_encode(array('status' => 498,'messages' => "Invalid Token or session expired"));
        }
        die();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        $headers = getallheaders();
        if($headers['token'] == Session::get('token'))
        {
            $data = json_decode(file_get_contents("php://input"));
            DB::table('messages')->insert(['message' => $data->message, 'time' => time()]);
            echo json_encode(array('status' => 200,'message' => "success"));
        }
        else
        {
            echo json_encode(array('status' => 498,'messages' => "Invalid Token or session expired"));
        }
        die();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        $headers = getallheaders();
        if($headers['token'] == Session::get('token'))
        {
            $messages = DB::table('messages')->where('id',$id)->get();
            foreach ($messages as $key => $message)
            {
                $message->time = date('H:i A j M, Y',$message->time);
            }
            echo json_encode(array('status' => 200,'messages' => $messages));
        }
        else
        {
            echo json_encode(array('status' => 498,'messages' => "Invalid Token or session expired"));
        }
        die();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id)
    {
        $headers = getallheaders();
        if($headers['token'] == Session::get('token'))
        {
            $data = json_decode(file_get_contents("php://input"));
            DB::table('messages')->where('id',$id)->update(['message' => $data->message]);
            echo json_encode(array('status' => 200,'message' => "success"));
        }
        else
        {
            echo json_encode(array('status' => 498,'messages' => "Invalid Token or session expired"));
        }
        die();  
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        $headers = getallheaders();
        if($headers['token'] == Session::get('token'))
        {
            DB::table('messages')->where('id',$id)->delete();
            echo json_encode(array('status' => 200,'message' => "success"));
        }
        else
        {
            echo json_encode(array('status' => 498,'messages' => "Invalid Token or session expired"));
        }
        die();
    }

}

-module(vo_room).
-behaviour(gen_server).

-export([start_link/0]).

-export([init/1]).
-export([handle_call/3]).
-export([handle_cast/2]).
-export([handle_info/2]).
-export([terminate/2]).
-export([code_change/3]).


-spec start_link() -> {ok, pid()}.
start_link() ->
    gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

init([]) ->
    lager:info("Room started~n", []),
    {ok, #{sessions=>[]}}.

handle_call({join, Pid}, _From, #{sessions:=Sessions} = State) ->
    lager:info("~p joined room~n", [Pid]),
    {reply, ok, State#{sessions=>[Pid|Sessions]}};

handle_call({leave, Pid}, _From, #{sessions:=Sessions} = State) ->
    lager:info("~p left room~n", [Pid]),
    {reply, ok, State#{sessions=>Sessions -- [Pid]}};

handle_call({broadcast, Data, Pid}, _From, #{sessions:=Sessions} = State) ->
    lager:info("Broadcasting ~p for ~p~n", [Data, Pid]),
    broadcast(Data, Pid, Sessions),
    {reply, ok, State};

handle_call(_Request, _From, State) ->
    {reply, ignored, State}.

handle_cast(_Msg, State) ->
    {noreply, State}.

handle_info(_Info, State) ->
    {noreply, State}.

terminate(_Reason, _State) ->
    ok.

code_change(_OldVsn, State, _Extra) ->
    {ok, State}.

broadcast(Data, Pid, Sessions) ->
    lists:foreach(fun(SubPid) -> SubPid ! {broadcast, Data} end, Sessions -- [Pid]).

-module(vo_connect_handler).

-behaviour(cowboy_websocket_handler).

-export([init/3]).
-export([websocket_init/3]).
-export([websocket_handle/3]).
-export([websocket_info/3]).
-export([websocket_terminate/3]).

init({tcp, http}, _Req, _Opts) ->
    {upgrade, protocol, cowboy_websocket}.

websocket_init(_Type, Req, _Opts) ->
    {Header,_} = cowboy_req:header(<<"x-forwarded-user">>, Req),
    User = get_user_name(Header),
    ok = gen_server:call(vo_room, {join, User, self()}),
    {ok, Req, #{user=>User}}.

get_user_name(undefined) ->
    uuid:uuid_to_string(uuid:get_v4(), binary_standard);

get_user_name(User) ->
    User.

websocket_handle({text, Json}, Req, #{user:=User} = State) ->
    Msg = jiffy:decode(Json, [return_maps]),
    Type = maps:get(<<"type">>, Msg),
    case Type of
        <<"snapshot">> ->
            Data = #{type=><<"snapshot">>, data=>maps:get(<<"data">>, Msg), from=>User},
            ok = gen_server:call(vo_room, {broadcast, jiffy:encode(Data), self()}),
            {ok, Req, State};
        <<"call">> ->
            #{<<"who">>:=Who, <<"offer">>:=Offer} = Msg,
            ok = gen_server:cast(vo_room, {initiate_call, Who, Offer, User}),
            {ok, Req, State}
    end.

websocket_info({broadcast, Data}, Req, State) ->
    {reply, {text, Data}, Req, State}.

websocket_terminate(_Reason, _Req, #{user:=User}) ->
    gen_server:call(vo_room, {leave, User, self()}).

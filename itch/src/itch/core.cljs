(ns itch.core
  (:require [reagent.core :as reagent :refer [atom]]
            [clojure.tools.reader :as r]
            [clojure.tools.reader.edn :as edn]
            [cljs.js :as cljs]
            [lentes.core :as l]
            [cljs.core.match :refer-macros [match]]
            [cljs.analyzer :as ana]))

(enable-console-print!)

;(println "This text is printed from src/itch/core.cljs. Go ahead and edit it and see reloading in action.")

;(println (with-out-str (cljs.pprint/pprint (ana/analyze (ana/empty-env) (edn/read-string "(+ 1 1)")))))
;https://github.com/swannodette/swannodette.github.com/blob/master/code/blog/src/blog/cljs_next/core.cljs
;http://swannodette.github.io/2015/07/29/clojurescript-17
(defn elide-env [env ast opts]
  (dissoc ast :env))
(def st (cljs/empty-state))
(defonce ast (atom nil))

(defn add-coords [value]
  (->> value
       (merge {:x 100 :y 100})
       (l/over (l/key :args) #(vec (map add-coords %)))))

(defn add-coords-root [root]
  (l/over (l/key :value) add-coords root))

(cljs/analyze-str st "(+ 1 (+ 2 3))" nil
                  {:passes [ana/infer-type elide-env]}
                  (fn [{:keys [error value] :as res}]
                    (reset! ast (add-coords-root res))))
(defn all-items [ast] (flatten [ast (map all-items (:args ast))]))

(defn get-name [ast]
  (match [(:op ast)]
    [:js] (name (:js-op ast))
    [:const] (:val ast)
    :else (:op ast)))

(defonce app-state (atom {:text "Hello world!"}))

(defn nest-lens-nodes [node]
  (concat
   [node]
   (map-indexed
    #(nest-lens-nodes (l/derive (comp (l/key :args) (l/nth %)) node)) (:args @node))))

(defn nodes-to-connections
  [[from & tos]]
  (flatten
   (concat
    (map (fn [[to]] {:from from :to to}) tos)
    (map nodes-to-connections tos))))

(defn draggable
  [position, children]
  (let [is-dragging (atom false)
        on-mouse-move (fn [e]
                        (.-preventDefault e)
                        (.-stopPropagation e)
                        (swap! position assoc
                               :x (+ (:x @position) (-> e .-nativeEvent .-movementX))
                               :y (+ (:y @position) (-> e .-nativeEvent .-movementY))))]
    (fn []
      [:g {:on-mouse-down #(reset! is-dragging true)
           :on-mouse-out #(reset! is-dragging false)
           :on-mouse-up #(reset! is-dragging false)
           :on-mouse-move (when @is-dragging on-mouse-move)
           :style {:transform (str "translate(" (:x @position) "px, " (:y @position) "px)")}}

       children])))

(defn node-renderer
  [node]
    [:<> {:key (hash node)}
     [draggable
      node
      [:<>
       [:rect
        {:width 100
         :height 100
         :x 50
         :y 50
         :stroke "#000"
         :fill "#FFF"}]
       [:text {:x (- (:x @node) 10) :y (+ (:y @node) 20) :style {:font-size 50}} (get-name @node)]]]
     ])

(defn connection-renderer
  [in]
  (let [from (:from in)
        to (:to in)]
       
       [:line {:x1 (:x @from)
               :x2 (:x @to)
               :y1 (:y @from)
               :y2 (:y @to)}]))

(defn my-input [value]
  (let [is-writeable (atom false)]
    (fn [] [:input {:on-click #(swap! is-writeable not)
                    :on-change (when @is-writeable #(reset! value (-> % .-target .-value)))
                    :value @value}])))
(def my-value (atom ""))

(defn hello-world []
  (when @ast
    (let [nested-lenses (nest-lens-nodes (l/derive (l/key :value) ast))]
      (fn []
        [:div
         #_[:pre (with-out-str (cljs.pprint/pprint (all-items (:value @ast))))]
         [:pre (with-out-str (cljs.pprint/pprint @ast))]
         [my-input my-value]
         [:svg {:viewBox "0 0 1024 762" :width 1024 :height 762 :xmlns "http://www.w3.org/2000/svg"}
          (doall (map node-renderer (flatten nested-lenses)))
          ;(map connection-renderer (nodes-to-connections (nest-lens-nodes (l/derive (l/key :value) ast))))
          ]]))))

(reagent/render-component [hello-world]
                          (. js/document (getElementById "app")))

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
  )
